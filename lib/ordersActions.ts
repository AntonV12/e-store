"use server";

import { pool } from "@/lib/database";
import { OrderType, EncryptedOrderType, CreateOrderState, UpdateOrderState, CartType } from "@/lib/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import CryptoJS from "crypto-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const fetchOrders = async (
  clientId: string | null,
  limit: number,
  done: boolean,
  isAdmin: boolean,
): Promise<OrderType[] | null> => {
  try {
    const sql = isAdmin
      ? "SELECT * FROM orders WHERE isDone = ? LIMIT ?"
      : "SELECT * FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
    const params = isAdmin ? [done, Number(limit) || 10] : [clientId, done, Number(limit) || 10];
    const [rows] = await pool.query<EncryptedOrderType[] & RowDataPacket[]>(sql, params);

    if (rows.length === 0) return null;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const results: OrderType[] = [];

    const allProductIds: number[] = [];
    const orderProductsMap = new Map<string, CartType[]>();

    for (const row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(row.encryptedOrder, secretKey).toString(CryptoJS.enc.Utf8);

      const { products }: { products: CartType[] } = JSON.parse(decryptedOrders);

      orderProductsMap.set(String(row.id), products);

      products.forEach((product: CartType) => {
        if (product.productId && !allProductIds.includes(product.productId)) {
          allProductIds.push(product.productId);
        }
      });
    }

    let productRatings: Record<string, number> = {};

    if (allProductIds.length > 0) {
      const ratingSql = `
        SELECT productId, AVG(rating) as averageRating 
        FROM ratings 
        WHERE productId IN (?) AND userId IN (?)
        GROUP BY productId
      `;

      const [ratingRows] = await pool.query<{ productId: string; averageRating: number }[] & RowDataPacket[]>(
        ratingSql,
        [allProductIds, clientId],
      );

      productRatings = ratingRows.reduce(
        (acc, row) => {
          acc[row.productId] = Number(row.averageRating) || 0;
          return acc;
        },
        {} as Record<string, number>,
      );
    }

    for (const row of rows) {
      const decryptedOrder = CryptoJS.AES.decrypt(row.encryptedOrder, secretKey).toString(CryptoJS.enc.Utf8);

      const { id, clientId, isDone } = row;

      const parsedOrders: OrderType = JSON.parse(decryptedOrder);

      const { username, phone, email, address, products: originalProducts, date } = parsedOrders;

      const productsWithRating: CartType[] = originalProducts.map((product: CartType) => ({
        ...product,
        rating: productRatings[Number(product.productId)] || 0,
      }));

      results.push({
        id,
        username,
        clientId,
        phone,
        email,
        address,
        products: productsWithRating,
        isDone,
        date,
      });
    }

    return results ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getOrdersLength = async (userId: string | null): Promise<number | null> => {
  const tempId: string | null = (await cookies()).get("tempId")?.value || null;

  try {
    const sql = `SELECT COUNT(*) AS count FROM orders WHERE clientId = ? AND isDone = 0`;
    const [results] = await pool.execute<{ count: number } & RowDataPacket[]>(sql, [userId || tempId]);

    return results[0].count;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createOrder = async (prevState: CreateOrderState, formData: FormData): Promise<CreateOrderState> => {
  const username = formData.get("username");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const city = formData.get("city");
  const street = formData.get("street");
  const house = formData.get("house");
  const apartment = formData.get("apartment");
  const products: CartType[] = prevState.formData?.products || JSON.parse(formData.get("products") as string);
  const isDone = (prevState.formData?.isDone as "0" | "1") || "0";
  const date = prevState.formData?.date || new Date().toISOString();
  const clientId = prevState.formData?.clientId || "";

  const userAddress: string = `г.${city}, ул.${street}, дом ${house}${apartment ? ", " + apartment : ""}`;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
  const encryptedOrder = CryptoJS.AES.encrypt(
    JSON.stringify({
      username: username,
      phone: phone,
      email: String(email),
      address: userAddress,
      products: products,
      date: date,
    }),
    secretKey,
  ).toString();

  const newOrder: EncryptedOrderType = {
    id: null,
    encryptedOrder,
    clientId: clientId,
    isDone: isDone,
  };

  const validatePhoneNumber = (phone: string) => /^\+\d \(\d{3}\) \d{3}-\d{2}\d{2}$/.test(phone);

  if (!phone || !email || !city || !street || !house || !products?.length || !validatePhoneNumber(String(phone))) {
    return {
      error: "Заполните все поля",
      formData: prevState.formData,
    };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [results] = await connection.query<ResultSetHeader>("INSERT INTO orders SET ?", [newOrder]);
    await connection.query<ResultSetHeader>("DELETE FROM carts WHERE userId = ?", [clientId]);
    await connection.commit();

    revalidatePath("/cart");

    return {
      message: `Заказ № ${results.insertId} успешно создан`,
    };
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return {
      error: "Internal server error",
      formData: prevState.formData,
    };
  } finally {
    connection.release();
  }
};

export const updateOrder = async (
  isAdmin: boolean,
  prevState: UpdateOrderState,
  formData: FormData,
): Promise<UpdateOrderState> => {
  const isDone = Number(formData.get("isDone"));
  const id = Number(prevState.formData?.id);

  if (!isAdmin) {
    return {
      error: "Недостаточно прав",
      formData: prevState.formData,
    };
  }

  try {
    await pool.execute<ResultSetHeader>("UPDATE orders SET isDone = ? WHERE id = ?", [!isDone, id]);
    revalidatePath("/orders");
    return { message: `Заказ № ${id} успешно обновлен` };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error", formData: prevState.formData };
  }
};
