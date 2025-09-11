"use server";

import { pool } from "@/lib/database";
import {
  OrderType,
  EncryptedOrderType,
  CreateOrderState,
  UpdateOrderState,
} from "@/lib/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import CryptoJS from "crypto-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// export const fetchOrders = async (
//   clientId: string,
//   limit: number,
//   done: boolean,
//   isAdmin: boolean,
// ): Promise<OrderType[] | null> => {
//   try {
//     const sql = isAdmin
//       ? "SELECT * FROM orders WHERE isDone = ? LIMIT ?"
//       : "SELECT * FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
//     const params = isAdmin
//       ? [done, Number(limit) || 10]
//       : [clientId, done, Number(limit) || 10];
//     const [rows] = await pool.query<OrderType[] & RowDataPacket[]>(sql, params);

//     if (rows.length === 0) return null;

//     const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
//     const results: OrderType[] = [];

//     for (const row of rows) {
//       const decryptedOrders = CryptoJS.AES.decrypt(
//         row.encryptedOrder,
//         secretKey,
//       ).toString(CryptoJS.enc.Utf8);

//       const { id, clientId, isDone } = row;
//       const { phone, email, address, products, date } =
//         JSON.parse(decryptedOrders);

//       results.push({
//         id,
//         clientId,
//         phone,
//         email,
//         address,
//         products,
//         isDone,
//         date,
//       });
//     }

//     return results ?? null;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

export const fetchOrders = async (
  clientId: string,
  limit: number,
  done: boolean,
  isAdmin: boolean,
): Promise<OrderType[] | null> => {
  try {
    const sql = isAdmin
      ? "SELECT * FROM orders WHERE isDone = ? LIMIT ?"
      : "SELECT * FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
    const params = isAdmin
      ? [done, Number(limit) || 10]
      : [clientId, done, Number(limit) || 10];
    const [rows] = await pool.query<OrderType[] & RowDataPacket[]>(sql, params);

    if (rows.length === 0) return null;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const results: OrderType[] = [];

    const allProductIds: string[] = [];
    const orderProductsMap = new Map<string, any[]>(); // orderId -> products array

    for (const row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(
        row.encryptedOrder,
        secretKey,
      ).toString(CryptoJS.enc.Utf8);

      const { products } = JSON.parse(decryptedOrders);

      orderProductsMap.set(row.id, products);

      products.forEach((product: any) => {
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

      const [ratingRows] = await pool.query<
        { productId: string; averageRating: number }[] & RowDataPacket[]
      >(ratingSql, [allProductIds, clientId]);

      productRatings = ratingRows.reduce(
        (acc, row) => {
          acc[row.productId] = Number(row.averageRating) || 0;
          return acc;
        },
        {} as Record<string, number>,
      );
    }

    for (const row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(
        row.encryptedOrder,
        secretKey,
      ).toString(CryptoJS.enc.Utf8);

      const { id, clientId, isDone } = row;
      const {
        username,
        phone,
        email,
        address,
        products: originalProducts,
        date,
      } = JSON.parse(decryptedOrders);

      // Добавляем рейтинг к каждому продукту
      const productsWithRating = originalProducts.map((product: any) => ({
        ...product,
        rating: productRatings[product.productId] || 0,
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

export const getOrdersLength = async (userId: number | null): number | null => {
  const tempId: string | null = (await cookies()).get("tempId")?.value;

  try {
    const sql = `SELECT COUNT(*) AS count FROM orders WHERE clientId = ? AND isDone = 0`;
    const [results] = await pool.execute(sql, [userId || tempId]);
    return results[0].count;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createOrder = async (
  prevState: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> => {
  const username = formData.get("username");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const city = formData.get("city");
  const street = formData.get("street");
  const house = formData.get("house");
  const apartment = formData.get("apartment");
  const products =
    prevState.formData?.products ||
    JSON.parse(formData.get("products") as string);
  const isDone = (prevState.formData?.isDone as "0" | "1") || "0";
  const date = prevState.formData?.date || new Date().toISOString();
  const clientId = prevState.formData?.clientId;

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

  const validatePhoneNumber = (phone: string) =>
    /^\+\d \(\d{3}\) \d{3}-\d{2}\d{2}$/.test(phone);

  if (
    !phone ||
    !email ||
    !city ||
    !street ||
    !house ||
    !products?.length ||
    !validatePhoneNumber(String(phone))
  ) {
    return {
      error: "Заполните все поля",
      formData: prevState.formData,
    };
  }

  try {
    const [results] = await pool.query<ResultSetHeader>(
      "INSERT INTO orders SET ?",
      [newOrder],
    );
    await pool.query<ResultSetHeader>("DELETE FROM carts WHERE userId = ?", [
      clientId,
    ]);
    revalidatePath("/cart");

    return {
      message: `Заказ № ${results.insertId} успешно создан`,
    };
  } catch (err) {
    console.error(err);
    return {
      error: "Internal server error",
    };
  }
};

export const updateOrder = async (
  isAdmin: boolean,
  prevState: UpdateOrderState,
  formData: FormData,
): Promise<UpdateOrderState> => {
  const isDone = Number(formData.get("isDone"));
  const id = Number(prevState.formData?.id);

  if (!isAdmin) return;

  try {
    await pool.execute<ResultSetHeader>(
      "UPDATE orders SET isDone = ? WHERE id = ?",
      [!isDone, id],
    );
    revalidatePath("/orders");
    return { message: `Заказ № ${id} успешно обновлен` };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error", formData: prevState.formData };
  }
};
