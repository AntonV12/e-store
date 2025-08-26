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

export const fetchOrders = async (
  limit: number,
  done: boolean,
  isAdmin: boolean,
): Promise<OrderType[] | null> => {
  try {
    const sql = isAdmin
      ? "SELECT * FROM orders WHERE isDone = ? LIMIT ?"
      : "SELECT * FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
    const [rows] = await pool.query<OrderType[] & RowDataPacket[]>(sql, [
      done,
      Number(limit) || 10,
    ]);

    if (rows.length === 0) return null;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const results: OrderType[] = [];

    for (let row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(
        row.encryptedOrder,
        secretKey,
      ).toString(CryptoJS.enc.Utf8);

      const { id, clientId, isDone } = row;
      const { phone, email, address, products, date } =
        JSON.parse(decryptedOrders);

      results.push({
        id,
        clientId,
        phone,
        email,
        address,
        products,
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

export const createOrder = async (
  prevState: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> => {
  const phone = formData.get("phone");
  const email = formData.get("email");
  const city = formData.get("city");
  const street = formData.get("street");
  const house = formData.get("house");
  const apartment = formData.get("apartment");
  const products = prevState.formData?.products;
  const isDone = prevState.formData?.isDone as "0" | "1";
  const date = prevState.formData?.date;
  const clientId = Number(prevState.formData?.clientId);

  const userAddress: string = `г.${city}, ул.${street}, дом ${house}${apartment ? ", " + apartment : ""}`;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
  const encryptedOrder = CryptoJS.AES.encrypt(
    JSON.stringify({
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

// export const updateOrder = async (params: {
//   id: number;
//   param: string;
//   value: string | number | boolean;
// }): Promise<{ message: string } | { error: string }> => {
//   try {
//     const { id, param, value } = params;

//     const [results] = await pool.execute<ResultSetHeader>(`UPDATE orders SET \`${param}\` = ? WHERE id = ?`, [
//       value,
//       id,
//     ]);

//     if (results.affectedRows === 0) {
//       return { error: "Order not found" };
//     }

//     return { message: `Заказ № ${id} успешно обновлен` };
//   } catch (err) {
//     console.error(err);
//     return { error: "Internal server error" };
//   }
// };

export const updateOrder = async (
  prevState: UpdateOrderState,
  formData: FormData,
): Promise<UpdateOrderState> => {
  const isDone = Number(formData.get("isDone"));
  const id = Number(prevState.formData?.id);

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
