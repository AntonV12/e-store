import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { RowDataPacket } from "mysql2/promise";

export const fetchUserById = async (id: number): Promise<UserType | null> => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length > 0 ? (rows[0] as UserType) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
