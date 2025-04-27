import { pool } from "@/lib/database";
import { Product } from "@/lib/features/products/productsApiSlice";

export const fetchProducts = async (limit: number): Promise<Product[] | null> => {
  try {
    const [results] = await pool.query("SELECT * FROM products LIMIT ?", [limit]);
    return results as Product[];
  } catch (err) {
    console.error(err);
    return null;
  }
};
