import "server-only";
import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createSession, decrypt } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false, userId: null, isAdmin: false };
  }

  return { isAuth: true, userId: session.userId, isAdmin: session.isAdmin };
});

export const loginUser = async (user: UserType): Promise<{ message: string } | { error: string }> => {
  try {
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [
      user.name,
    ]);

    if (!existingUser.length) {
      return { error: "Пользователь с таким именем не зарегистрирован" };
    }

    if (!bycript.compareSync(user.password, existingUser[0].password)) {
      return { error: "Неверный пароль" };
    }

    await createSession(existingUser[0].id, existingUser[0].isAdmin);

    return { message: "Пользователь успешно авторизован" };
  } catch (err) {
    console.error(err);
    return { error: "Internal server error" };
  }
};

export async function getCurrentUser() {
  const session = await verifySession();

  if (!session.userId) {
    return null;
  }

  const [results] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [session.userId]);

  if (!results.length) {
    return null;
  }

  const user = results[0];

  return {
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}
