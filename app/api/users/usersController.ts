import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { RowDataPacket } from "mysql2";

export const fetchUsers = async (limit: number): Promise<UserType[] | null> => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT ?", [limit]);
    return rows as UserType[];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createUser = async (user: UserType): Promise<UserType | null> => {
  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [user.name]);

    if (existingUser.length) {
      return null;
    }

    const [results] = await pool.query<RowDataPacket[]>("INSERT INTO users SET ?", [user]);
    return results[0] as UserType;
  } catch (err) {
    console.error(err);
    return null;
  }
};
