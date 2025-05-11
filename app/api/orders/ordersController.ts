import { pool } from "@/lib/database";
import { OrderType } from "@/lib/types/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createOrder = async (
  order: OrderType
): Promise<{ orderNumber: number; message: string } | { error: string }> => {
  try {
    const [results] = await pool.query<ResultSetHeader>("INSERT INTO orders SET ?", [order]);
    return { orderNumber: results.insertId, message: `Заказ № ${results.insertId} создан` };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};

export const fetchOrdersByUserId = async (userId: number): Promise<OrderType[] | null> => {
  try {
    const sql = "SELECT id, clientId, products FROM orders WHERE clientId = ?";
    const [results] = await pool.execute<OrderType[] & RowDataPacket[]>(sql, [userId]);
    return results ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
