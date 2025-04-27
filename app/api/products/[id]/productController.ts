import { pool } from "@/lib/database";
import { Product } from "@/lib/features/products/productsApiSlice";
import { RowDataPacket } from "mysql2";
import { ProductType } from "@/lib/types/types";

export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const [rows] = await pool.query<(Product & RowDataPacket)[]>("SELECT * FROM products WHERE id = ?", [id]);

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
