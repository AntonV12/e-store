import { pool } from "@/lib/database";
import { UserType } from "@/lib/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createUser = async (user: UserType): Promise<{ message: string } | { error: string }> => {
  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [user.name]);

    if (existingUser.length) {
      return { error: "Пользователь с таким именем уже зарегистрирован" };
    }

    const userForInsert = {
      ...user,
      cart: JSON.stringify(user.cart || []),
    };

    await pool.query<ResultSetHeader>("INSERT INTO users SET ?", [userForInsert]);

    return { message: "Пользователь зарегистрирован" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};
