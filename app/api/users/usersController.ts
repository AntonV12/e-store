import { pool } from "@/lib/database";

export const fetchUsers = async (limit: number) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT ?", [limit]);
    const length: any = await pool.query("SELECT COUNT(*) as count FROM users");
    return { users: rows, total: length[0][0] };
  } catch (err) {
    console.error(err);
  }
};
