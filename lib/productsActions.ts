"use server";

import { pool } from "@/lib/database";
import { ProductType, SortType, CommentType, UpdateCommentsState, CreateProductState } from "@/lib/types";
import { ResultSetHeader } from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import { verifySession } from "@/lib/authActions";
import { writeFile, rm } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export const fetchProducts = async (
  name?: string,
  limit?: number,
  page?: number,
  category?: string,
  sortBy?: SortType,
  sortByDirection?: "asc" | "desc"
): Promise<{ products: ProductType[]; count: number } | null> => {
  try {
    const offset = page ? (page - 1) * 10 : 0;

    const [count] = await pool.query<{ count: number } & RowDataPacket[]>(
      `
        SELECT COUNT(*) AS count FROM products
        WHERE name LIKE ? AND (? IS NULL OR category = ?)
      `,
      [`%${name || ""}%`, category || null, category || null]
    );

    const [results] = await pool.query<ProductType[] & RowDataPacket[]>(
      `
        SELECT 
          p.*,
          COALESCE((
            SELECT AVG(rating) 
            FROM ratings 
            WHERE productId = p.id
          ), 0) as rating
        FROM products p
        WHERE p.name LIKE ? AND (? IS NULL OR p.category = ?)
        ORDER BY ${sortBy || "viewed"} ${sortByDirection || "desc"}, p.id DESC
        LIMIT ?
        OFFSET ?
      `,
      [`%${name || ""}%`, category || null, category || null, Number(limit) || 10, offset]
    );

    return {
      products: results,
      count: Math.ceil(count[0].count / 10),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createProduct = async (prevState: CreateProductState, formData: FormData): Promise<CreateProductState> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const cost = Number(formData.get("cost"));
    const description = formData.get("description") as string;
    const imageFiles = formData.getAll("images") as File[];
    const imagesSize = imageFiles.reduce((acc, image) => acc + image.size, 0);

    if (imagesSize > 100 * 1024 * 1024) {
      return {
        error: "Размер файлов не должен превышать 100 МБ",
      };
    }

    const [existingProduct] = await pool.execute<ProductType & RowDataPacket[]>(
      `SELECT * FROM products WHERE name = ?`,
      [name]
    );

    if (existingProduct.length > 0) {
      return {
        error: "Товар с таким названием уже существует",
      };
    }

    const dir = path.join(process.cwd(), "uploads");
    const fileNames: string[] = [];

    for (const imageFile of imageFiles) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
      const filePath = path.join(dir, filename);
      fileNames.push(filename);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const processedImageBuffer = await sharp(buffer)
        .resize(500, 500, {
          fit: "contain",
          position: "center",
          background: { r: 255, g: 255, b: 255 },
        })
        .webp();

      await writeFile(filePath, processedImageBuffer);
    }

    const newProduct = {
      id: null,
      name,
      category,
      viewed: 0,
      cost,
      imageSrc: fileNames,
      description,
      comments: [],
    };

    const [result] = await pool.query<ResultSetHeader>(`INSERT INTO products SET ?`, {
      ...newProduct,
      imageSrc: JSON.stringify(newProduct.imageSrc),
      comments: JSON.stringify(newProduct.comments),
    });

    if (result.affectedRows > 0) {
      return {
        message: "Товар успешно добавлен",
        formData: {
          ...newProduct,
          id: result.insertId,
          rating: 0,
        },
      };
    }

    return {
      error: "Произошла ошибка при добавлении товара",
    };
  } catch (err) {
    console.error(err);
    return {
      error: "Произошла ошибка при добавлении товара",
    };
  }
};

export const fetchCategories = async (): Promise<string[] | null> => {
  try {
    const [rows] = await pool.execute<(string[] & RowDataPacket)[]>(
      "SELECT JSON_ARRAYAGG(category) AS categories FROM (SELECT DISTINCT category FROM products) AS distinct_categories"
    );

    return rows[0].categories ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const [product] = await pool.execute<(ProductType & RowDataPacket)[]>("SELECT * FROM products WHERE id = ?", [id]);

    const [rating] = await pool.execute<{ avg: number } & RowDataPacket[]>(
      "SELECT AVG(rating) AS avg FROM ratings WHERE productId = ?",
      [id]
    );

    return { ...product[0], rating: rating[0]?.avg || 0 };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateComments = async (
  productId: number,
  prevState: UpdateCommentsState,
  formData: FormData
): Promise<UpdateCommentsState> => {
  const [comments] = await pool.execute<(CommentType & RowDataPacket)[]>("SELECT comments FROM products WHERE id = ?", [
    productId,
  ]);

  if (!productId) return { error: "Invalid product ID" };

  const id = Date.now().toString();
  const text = formData.get("text");
  const date = new Date();
  const authorId = formData.get("author");

  const [author] = await pool.execute<(string & RowDataPacket)[]>(`SELECT name FROM users WHERE id = ?`, [authorId]);

  const newComment = {
    id,
    text,
    date: date.toISOString(),
    author: author[0].name,
  };

  const updatedComments = [...(comments[0].comments ?? []), newComment];

  try {
    await pool.execute<ResultSetHeader>("UPDATE products SET comments = ? WHERE id = ?", [
      JSON.stringify(updatedComments),
      productId,
    ]);

    revalidatePath(`/products/${productId}`);

    return { message: "Комментарий успешно добавлен" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};

export const updateRating = async (productId: number | null, userId: string, rating: number) => {
  try {
    await pool.execute(`INSERT INTO ratings (productId, userId, rating) VALUES(?, ?, ?)`, [productId, userId, rating]);
  } catch (err) {
    console.error(err);
    return { message: "Вы уже оценили этот товар" };
  }
};

export const updateProduct = async (
  id: number,
  prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return { message: "Unauthorized" };
    }

    if (!id) {
      return { message: "Product ID not found" };
    }

    const [existingProduct] = await pool.execute<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
    const { viewed, imageSrc, comments } = existingProduct[0];

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const cost = Number(formData.get("cost"));
    const imageFiles: File[] | string[] = formData.getAll("images") as File[] | string[];
    const description = formData.get("description") as string;

    const dir = path.join(process.cwd(), "uploads");
    const fileNames: string[] = [];

    if (imageFiles.length > 0 /* && imageFiles[0].size > 0 */) {
      for (const imageFile of imageFiles) {
        if (typeof imageFile === "string") {
          fileNames.push(imageFile);
        } else {
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
      }
    }

    if (imageSrc) {
      imageSrc.forEach((image: string) => {
        if (!fileNames.includes(image)) {
          const filePath = path.join(dir, image);
          rm(filePath);
        }
      });
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
        return { message: "Forbidden" };
      }
    }

    const updatedProduct: Omit<ProductType, "rating"> = {
      id: +id,
      name,
      category,
      viewed,
      cost,
      imageSrc: fileNames,
      description,
      comments,
    };

    const sql = `UPDATE products SET ? WHERE id = ?`;

    await pool.query<ResultSetHeader>(sql, [
      {
        ...updatedProduct,
        imageSrc: JSON.stringify(updatedProduct.imageSrc),
        comments: JSON.stringify(updatedProduct.comments),
      },
      id,
    ]);

    revalidatePath(`/products/${id}`);

    return {
      message: "Продукт успешно обновлен",
    };
  } catch (err) {
    console.error(err);
    return { message: "Database error" };
  }
};
