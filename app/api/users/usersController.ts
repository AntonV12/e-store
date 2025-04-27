import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createSession } from "@/lib/sessions";

/* export const fetchUsers = async (limit: number): Promise<UserType[] | null> => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT ?", [limit]);
    return rows as UserType[];
  } catch (err) {
    console.error(err);
    return null;
  }
}; */

export const createUser = async (user: UserType): Promise<{ message: string } | { error: string }> => {
  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [user.name]);

    if (existingUser.length) {
      return { error: "Пользователь с таким именем уже зарегистрирован" };
    }

    const [results] = await pool.query<ResultSetHeader>("INSERT INTO users SET ?", [user]);

    /* return {
      id: results.insertId,
      name: user.name,
      password: user.password,
    }; */
    return { message: "Пользователь зарегистрирован" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};
