import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";

export const fetchUsers = async (limit: number): Promise<UserType[] | null> => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT ?", [limit]);
    return rows as UserType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};
