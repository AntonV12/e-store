import { pool } from "@/lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ProductType } from "@/lib/types/types";

export const fetchProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.execute<(ProductType & RowDataPacket)[]>("SELECT * FROM products WHERE id = ?", [id]);

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateProduct = async (product: ProductType): Promise<{ success: boolean; message: string }> => {
  try {
    const { id, name, category, viewed, rating, cost, imageSrc, description, comments } = product;
    const sql =
      "UPDATE products SET id = ?, name = ?, category = ?, viewed = ?, rating = ?, cost = ?, imageSrc = ?, description = ?, comments = ? WHERE id = ?";

    const [results] = await pool.execute<ResultSetHeader>(sql, [
      id,
      name,
      category,
      viewed,
      rating,
      cost,
      imageSrc,
      description,
      comments,
      id,
    ]);

    return {
      success: results.affectedRows > 0,
      message: results.affectedRows > 0 ? "Продукт успешно обновлен" : "Продукт не получилось обновить",
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Database error" };
  }
};
