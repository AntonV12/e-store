import { pool } from "@/lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ProductType } from "@/lib/types/types";
import { verifySession } from "@/app/api/auth/authController";

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
    const session = await verifySession();
    if (!session.userId) {
      return { success: false, message: "Unauthorized" };
    }

    const [existingProduct] = await pool.execute<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [product.id]);

    const { id, name, category, viewed, rating, cost, imageSrc, description, comments } = product;
    if (existingProduct[0] as ProductType) {
      if (
        !session.isAdmin &&
        (existingProduct[0].name !== name ||
          existingProduct[0].category !== category ||
          existingProduct[0].cost !== cost ||
          existingProduct[0].imageSrc !== imageSrc ||
          existingProduct[0].description !== description)
      ) {
        return { success: false, message: "Forbidden" };
      }
    }
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

export const deleteProduct = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return { success: false, message: "Unauthorized" };
    }

    if (!session.isAdmin) {
      return { success: false, message: "Forbidden" };
    }

    const [existingProduct] = await pool.execute<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);

    if (existingProduct.length === 0) {
      return { success: false, message: "Product not found" };
    }

    const [results] = await pool.execute<ResultSetHeader>("DELETE FROM products WHERE id = ?", [id]);

    return {
      success: results.affectedRows > 0,
      message: results.affectedRows > 0 ? "Продукт успешно удален" : "Продукт не получилось удалить",
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Database error" };
  }
};

export const updateViewed = async (id: number, params?: { rating?: number; viewed?: number }): Promise<void> => {
  try {
    const session = await verifySession();
    let sql;

    if (params?.viewed) {
      sql = "UPDATE products SET viewed = viewed + 1 WHERE id = ?";
      await pool.execute(sql, [id]);
    }

    if (params?.rating) {
      const { isAuth } = session;
      if (!isAuth) {
        return;
      }

      const checkRatingSql = `
        SELECT id 
        FROM products
        WHERE id = ? 
        AND JSON_CONTAINS(rating, JSON_OBJECT('author', ?), '$')
      `;

      const [existingRatings] = await pool.execute<RowDataPacket[]>(checkRatingSql, [id, session.userId]);

      if (existingRatings.length > 0) {
        return;
      }

      sql = `
        UPDATE products 
        SET rating = 
          IF(
            rating IS NULL, 
            JSON_ARRAY(JSON_OBJECT('author', ?, 'rating', ?)), 
            JSON_ARRAY_APPEND(rating, '$', JSON_OBJECT('author', ?, 'rating', ?))
          )
        WHERE id = ?
      `;
      await pool.execute(sql, [session.userId, params.rating, session.userId, params.rating, id]);
    }
  } catch (err) {
    console.error(err);
  }
};
