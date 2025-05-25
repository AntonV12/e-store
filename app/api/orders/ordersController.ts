import { pool } from "@/lib/database";
import { OrderType } from "@/lib/types/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createOrder = async (
  order: OrderType
): Promise<{ orderNumber: number; message: string } | { error: string }> => {
  try {
    const { products } = order;
    const [results] = await pool.query<ResultSetHeader>("INSERT INTO orders SET ?", [
      { ...order, products: JSON.stringify(products) },
    ]);
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
    const sql = "SELECT id, clientId, products, isDone, date FROM orders WHERE clientId = ? AND isDone = ? LIMIT ?";
    const [results] = await pool.query<OrderType[] & RowDataPacket[]>(sql, [userId, done, limit]);
    return results ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchOrders = async (limit: number, done: boolean): Promise<OrderType[] | null> => {
  try {
    const sql =
      "SELECT id, clientId, phone, email, address, products, isDone, date FROM orders WHERE isDone = ? LIMIT ?";
    const [results] = await pool.query<OrderType[] & RowDataPacket[]>(sql, [done, limit]);
    return results ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateOrder = async (order: OrderType): Promise<{ message: string } | { error: string }> => {
  try {
    const { id, ...updateData } = order;
    const [results] = await pool.query<ResultSetHeader>("UPDATE orders SET ? WHERE id = ?", [
      { ...updateData, products: JSON.stringify(updateData.products) },
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
