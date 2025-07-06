import { pool } from "@/lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { CommentType, ProductType } from "@/lib/types/types";
import { verifySession } from "@/app/api/auth/authController";
import path from "path";
import { writeFile, rm } from "fs/promises";

export const fetchProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.execute<(ProductType & RowDataPacket)[]>("SELECT * FROM products WHERE id = ?", [id]);

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateProduct = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return { success: false, message: "Unauthorized" };
    }

    const id = formData.get("id");

    if (!id) {
      return { success: false, message: "Product ID not found" };
    }

    const [existingProduct] = await pool.execute<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
    const { viewed, rating, imageSrc, comments } = existingProduct[0];

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const cost = Number(formData.get("cost"));
    const imageFiles = formData.getAll("images") as File[];
    const description = formData.get("description") as string;

    const dir = path.join(process.cwd(), "public", "images");
    const fileNames = [];

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      for (let imageFile of imageFiles) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
        const filePath = path.join(dir, filename);
        fileNames.push(filename);

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (imageFile.size) {
          await writeFile(filePath, new Uint8Array(buffer));
        }
      }

      if (imageSrc) {
        for (let image of imageSrc) {
          await rm(path.join(process.cwd(), "public", "images", image));
        }
      }
    }

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

    const updatedProduct: ProductType = {
      id: +id,
      name,
      category,
      viewed,
      rating,
      cost,
      imageSrc: fileNames.length ? fileNames : imageSrc,
      description,
      comments,
    };

    const sql = `UPDATE products SET ? WHERE id = ?`;

    const [results] = await pool.query<ResultSetHeader>(sql, [
      {
        ...updatedProduct,
        rating: JSON.stringify(updatedProduct.rating),
        imageSrc: JSON.stringify(updatedProduct.imageSrc),
        comments: JSON.stringify(updatedProduct.comments),
      },
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

    if (existingProduct[0].imageSrc) {
      for (let image of existingProduct[0].imageSrc) {
        await rm(path.join(process.cwd(), "public", "images", image));
      }
    }

    return {
      success: results.affectedRows > 0,
      message: results.affectedRows > 0 ? "Продукт успешно удален" : "Продукт не получилось удалить",
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Database error" };
  }
};

export const updateViewed = async (
  id: number,
  params?: { rating?: number; viewed?: number; comments?: CommentType[] }
): Promise<void> => {
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

    if (params?.comments) {
      sql = `UPDATE products SET comments = ? WHERE id = ?`;
      await pool.execute(sql, [JSON.stringify(params.comments), id]);
    }
  } catch (err) {
    console.error(err);
  }
};
