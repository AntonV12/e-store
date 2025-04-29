import { pool } from "@/lib/database";
import { ProductType } from "@/lib/types/types";

export const fetchProducts = async (limit: number): Promise<ProductType[] | null> => {
  try {
    const [results] = await pool.query("SELECT * FROM products LIMIT ?", [limit]);
    return results as ProductType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};
