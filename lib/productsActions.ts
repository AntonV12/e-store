"use server";

import { pool } from "@/lib/database";
import {
  ProductType,
  SortType,
  CommentType,
  UpdateCommentsState,
} from "@/lib/types";
import { ResultSetHeader } from "mysql2/promise";
import { RowDataPacket } from "mysql2";
// import { verifySession } from "@/app/api/auth/authController";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const fetchProducts = async (
  name?: string,
  limit?: number,
  page?: number,
  category?: string,
  sortBy?: SortType,
  sortByDirection?: "asc" | "desc",
): Promise<{ products: ProductType[]; count: number } | null> => {
  try {
    const offset = (page - 1) * 10 || 0;

    const [results] = await pool.query(
      `SELECT * FROM products WHERE name LIKE ? AND (? IS NULL OR category = ?) ORDER BY ${sortBy || "viewed"} ${
        sortByDirection || "desc"
      } LIMIT ? OFFSET ?`,
      [
        `%${name || ""}%`,
        category || null,
        category || null,
        Number(limit) || 10,
        offset,
      ],
    );

    const [count] = await pool.query(`SELECT COUNT(*) FROM products`);

    // return results as ProductType[];
    return {
      products: results,
      count: Math.ceil(count[0]["COUNT(*)"] / 10),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// export const createProduct = async (
//   formData: FormData,
// ): Promise<ProductType | null> => {
//   try {
//     const session = await verifySession();
//     if (!session.userId) {
//       return null;
//     }

//     const name = formData.get("name") as string;
//     const category = formData.get("category") as string;
//     const cost = Number(formData.get("cost"));
//     const description = formData.get("description") as string;
//     const imageFiles = formData.getAll("images") as File[];
//     const dir = path.join(process.cwd(), "uploads");
//     const fileNames: string[] = [];

//     for (let imageFile of imageFiles) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
//       const filePath = path.join(dir, filename);
//       fileNames.push(filename);

//       const bytes = await imageFile.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       await writeFile(filePath, new Uint8Array(buffer));
//     }

//     const newProduct = {
//       id: null,
//       name,
//       category,
//       viewed: 0,
//       rating: [],
//       cost,
//       imageSrc: fileNames,
//       description,
//       comments: [],
//     };

//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO products SET ?`,
//       {
//         ...newProduct,
//         rating: JSON.stringify(newProduct.rating),
//         imageSrc: JSON.stringify(newProduct.imageSrc),
//         comments: JSON.stringify(newProduct.comments),
//       },
//     );

//     if (result.affectedRows > 0) {
//       return newProduct;
//     }

//     return null;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

export const fetchCategories = async (): Promise<string[] | null> => {
  try {
    const [rows] = await pool.execute<(string[] & RowDataPacket)[]>(
      "SELECT JSON_ARRAYAGG(category) AS categories FROM (SELECT DISTINCT category FROM products) AS distinct_categories",
    );

    return rows[0].categories ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchProductById = async (
  id: number,
): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.execute<(ProductType & RowDataPacket)[]>(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateComments = async (
  productId: number,
  prevState: UpdateCommentsState,
  formData: FormData,
): Promise<UpdateCommentsState> => {
  const [comments] = await pool.execute<(CommentType & RowDataPacket)[]>(
    "SELECT comments FROM products WHERE id = ?",
    [productId],
  );

  if (!productId) return { error: "Invalid product ID" };

  const id = Date.now().toString();
  const text = formData.get("text");
  const date = new Date();
  const authorId = formData.get("author");

  const author = await pool.execute<(string & RowDataPacket)[]>(
    `SELECT name FROM users WHERE id = ${authorId}`,
  );

  const newComment = {
    id,
    text,
    date: date.toISOString(),
    author: author[0][0].name,
  };

  const updatedComments = [...(comments[0].comments ?? []), newComment];

  try {
    await pool.execute<ResultSetHeader>(
      "UPDATE products SET comments = ? WHERE id = ?",
      [JSON.stringify(updatedComments), productId],
    );

    revalidatePath(`/products/${productId}`);

    return { message: "Комментарий успешно добавлен" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};
