import { pool } from "@/lib/database";
import { RowDataPacket } from "mysql2";
import { ProductType } from "@/lib/types/types";

export const fetchProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.execute<(ProductType & RowDataPacket)[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateProduct = async (product: ProductType): Promise<ProductType | null> => {
  try {
    const { id, category, viewed, rating, cost, imageSrc, description, comments } = product;
    const sql =
      "UPDATE products SET id = ?, category = ?, viewed = ?, rating = ?, cost = ?, imageSrc = ?, description = ?, comments = ? WHERE id = ?";

    const [rows] = await pool.execute<(ProductType & RowDataPacket)[]>(sql, [
      id,
      category,
      viewed,
      rating,
      cost,
      imageSrc,
      description,
      comments,
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
