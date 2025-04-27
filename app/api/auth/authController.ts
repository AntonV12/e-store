import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createSession } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

export const loginUser = async (user: UserType): Promise<{ message: string } | { error: string }> => {
  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [user.name]);

    if (!existingUser.length) {
      return { error: "Пользователь с таким именем не зарегистрирован" };
    }

    if (!bycript.compareSync(user.password, existingUser[0].password)) {
      return { error: "Неверный пароль" };
    }

    await createSession(existingUser[0].id);

    return { message: "Пользователь успешно авторизован" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  const payload = await decrypt(session);

  if (!payload || !payload.userId) {
    return null;
  }

  const [results] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [payload.userId]);

  if (!results.length) {
    return null;
  }

  return results[0];
}
