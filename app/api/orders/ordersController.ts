import { pool } from "@/lib/database";
import { OrderType, EncryptedOrderType } from "@/lib/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import CryptoJS from "crypto-js";

export const createOrder = async (
  order: EncryptedOrderType
): Promise<{ orderNumber: number; message: string } | { error: string }> => {
  try {
    const [results] = await pool.query<ResultSetHeader>("INSERT INTO orders SET ?", [order]);
    return { orderNumber: results.insertId, message: `Заказ № ${results.insertId} успешно создан` };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};

export const fetchOrdersByUserId = async (
  userId: number,
  limit: number,
  done: boolean
): Promise<OrderType[] | null> => {
  try {
    const sql = "SELECT * FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
    const [rows] = await pool.query<OrderType[] & RowDataPacket[]>(sql, [userId, done, limit]);
    if (rows.length === 0) return null;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const results: OrderType[] = [];

    for (let row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(row.encryptedOrder, secretKey).toString(CryptoJS.enc.Utf8);

      const { id, clientId, isDone } = row;
      const { phone, email, address, products, date } = JSON.parse(decryptedOrders);

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

export const fetchOrders = async (limit: number, done: boolean): Promise<OrderType[] | null> => {
  try {
    const sql = "SELECT * FROM orders WHERE isDone = ? LIMIT ?";
    const [rows] = await pool.query<OrderType[] & RowDataPacket[]>(sql, [done, limit]);

    if (rows.length === 0) return null;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const results: OrderType[] = [];

    for (let row of rows) {
      const decryptedOrders = CryptoJS.AES.decrypt(row.encryptedOrder, secretKey).toString(CryptoJS.enc.Utf8);

      const { id, clientId, isDone } = row;
      const { phone, email, address, products, date } = JSON.parse(decryptedOrders);

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

export const updateOrder = async (params: {
  id: number;
  param: string;
  value: string | number | boolean;
}): Promise<{ message: string } | { error: string }> => {
  try {
    const { id, param, value } = params;

    const [results] = await pool.execute<ResultSetHeader>(`UPDATE orders SET \`${param}\` = ? WHERE id = ?`, [
      value,
      id,
    ]);

    if (results.affectedRows === 0) {
      return { error: "Order not found" };
    }

    return { message: `Заказ № ${id} успешно обновлен` };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};
