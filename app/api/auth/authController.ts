import "server-only";
import { pool } from "@/lib/database";
import { UserType } from "@/lib/types/types";
import { RowDataPacket } from "mysql2";
import { createSession, decrypt } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
import { cache } from "react";
import { updateSession } from "@/lib/sessions";

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
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [user.name]);

    if (!bycript.compareSync(user.password, existingUser[0].password) || !existingUser.length) {
      return { error: "Неверный логин или пароль" };
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

  const cookie = (await cookies()).get("session")?.value;
  const payload = await decrypt(cookie);
  const expiresAt = payload?.expiresAt;
  if (typeof expiresAt === "string" || typeof expiresAt === "number" || expiresAt instanceof Date) {
    const expires = new Date(expiresAt);
    if ((expires.getTime() - Date.now()) / 1000 / 60 / 60 / 24 < 1) {
      updateSession();
    }
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
    cart: user.cart,
    avatar: user.avatar,
  };
}
