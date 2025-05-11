import { pool } from "@/lib/database";
import { ProductType } from "@/lib/types/types";

export const fetchProducts = async (limit: number, name?: string, category?: string): Promise<ProductType[] | null> => {
  try {
    const [results] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ? AND (? IS NULL OR category = ?) LIMIT ?",
      [`%${name}%`, category || null, category || null, limit]
    );
    return results as ProductType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};
