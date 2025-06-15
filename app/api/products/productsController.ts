import { pool } from "@/lib/database";
import { ProductType, SortType } from "@/lib/types/types";
import { ResultSetHeader } from "mysql2/promise";
import { verifySession } from "@/app/api/auth/authController";

export const fetchProducts = async (
  limit: number,
  name?: string,
  category?: string,
  sortBy?: SortType,
  sortByDirection?: "asc" | "desc"
): Promise<ProductType[] | null> => {
  try {
    const [results] = await pool.query(
      `SELECT * FROM products WHERE name LIKE ? AND (? IS NULL OR category = ?) ORDER BY ${sortBy} ${sortByDirection} LIMIT ?`,
      [`%${name}%`, category || null, category || null, limit]
    );

    return results as ProductType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createProduct = async (product: ProductType): Promise<ProductType | null> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return null;
    }

    const { id, name, category, viewed, rating, cost, imageSrc, description, comments } = product;
    const [results] = await pool.query<ResultSetHeader>(
      "INSERT INTO products SET id = ?, name = ?, category = ?, viewed = ?, rating = ?, cost = ?, imageSrc = ?, description = ?, comments = ?",
      [id, name, category, viewed, JSON.stringify(rating), cost, imageSrc, description, JSON.stringify(comments)]
    );
    if (results.affectedRows > 0) {
      return { ...product, id: results.insertId };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
