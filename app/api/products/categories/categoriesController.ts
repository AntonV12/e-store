import { pool } from "@/lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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
