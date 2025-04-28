import { pool } from "@/lib/database";
import { RowDataPacket } from "mysql2";
import { ProductType } from "@/lib/types/types";

export const fetchProductById = async (id: number): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.query<(ProductType & RowDataPacket)[]>("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateProduct = async (product: ProductType): Promise<ProductType | null> => {
  try {
    const [rows] = await pool.query<(ProductType & RowDataPacket)[]>(
      "UPDATE products SET id, category, viewed, rating, cost, imageSrc, description, comments",
      [{ ...product }]
    );
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

/* 
  id: number | null;
    name: string;
    category: string;
    viewed: number;
    rating: number;
    cost: number;
    imageSrc: string;
    description: string;
    comments: CommentType[];
*/
