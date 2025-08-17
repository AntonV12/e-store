import { pool } from "@/lib/database";
import { ProductType, SortType } from "@/lib/types";
import { ResultSetHeader } from "mysql2/promise";
import { verifySession } from "@/app/api/auth/authController";
import { writeFile } from "fs/promises";
import path from "path";

export const fetchProducts = async (
  limit: number,
  name?: string,
  category?: string,
  sortBy?: SortType,
  sortByDirection?: "asc" | "desc"
): Promise<ProductType[] | null> => {
  try {
    const [results] = await pool.query(
      `SELECT * FROM products WHERE name LIKE ? AND (? IS NULL OR category = ?) ORDER BY ${sortBy || "viewed"} ${
        sortByDirection || "desc"
      } LIMIT ?`,
      [`%${name || ""}%`, category || null, category || null, limit || 10]
    );

    return results as ProductType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createProduct = async (formData: FormData): Promise<ProductType | null> => {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return null;
    }

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const cost = Number(formData.get("cost"));
    const description = formData.get("description") as string;
    const imageFiles = formData.getAll("images") as File[];
    const dir = path.join(process.cwd(), "uploads");
    const fileNames: string[] = [];

    for (let imageFile of imageFiles) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
      const filePath = path.join(dir, filename);
      fileNames.push(filename);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, new Uint8Array(buffer));
    }

    const newProduct = {
      id: null,
      name,
      category,
      viewed: 0,
      rating: [],
      cost,
      imageSrc: fileNames,
      description,
      comments: [],
    };

    const [result] = await pool.query<ResultSetHeader>(`INSERT INTO products SET ?`, {
      ...newProduct,
      rating: JSON.stringify(newProduct.rating),
      imageSrc: JSON.stringify(newProduct.imageSrc),
      comments: JSON.stringify(newProduct.comments),
    });

    if (result.affectedRows > 0) {
      return newProduct;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
