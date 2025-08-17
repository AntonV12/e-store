// import "server-only";
"use server";
import { pool } from "@/lib/database";
import { LoginState, UserType } from "@/lib/types";
import { RowDataPacket } from "mysql2";
import { createSession, decrypt } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
import { cache } from "react";
import { updateSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false, userId: null, isAdmin: false };
  }

  return { isAuth: true, userId: session.userId, isAdmin: session.isAdmin };
});

export const loginUser = async (prevState: LoginState | undefined, formData: FormData) => {
  try {
    const name = formData.get("name");
    const password = formData.get("password")?.toString();
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);

    if ((password && !bycript.compareSync(password, existingUser[0].password)) || !existingUser.length) {
      return {
        error: "Неверный логин или пароль",
        formData: {
          name: formData.get("name") as string,
          password: formData.get("password") as string,
        },
      };
    }

    await createSession(existingUser[0].id, existingUser[0].isAdmin);
  } catch (error) {
    return { error: "Internal server error" };
  }

  redirect("/");
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

  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, isAdmin, cart, avatar FROM users WHERE id = ?",
    [session.userId]
  );

  if (!results.length) {
    return null;
  }

  const user = results[0] as Omit<UserType, "password">;
  const { id, name, isAdmin, cart, avatar } = user;

  return {
    id,
    name,
    isAdmin,
    cart,
    avatar,
  };
}
