import { pool } from "@/lib/database";
import { OrderType, EncryptedOrderType } from "@/lib/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import CryptoJS from "crypto-js";

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
      done || false,
      limit || 10,
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
