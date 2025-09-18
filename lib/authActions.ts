"use server";

import { pool } from "@/lib/database";
import { LoginState, UserType } from "@/lib/types";
import { RowDataPacket } from "mysql2";
import { createSession, decrypt } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
import { cache } from "react";
import { SessionType } from "@/lib/types";

export const verifySession = async (): Promise<SessionType> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = (await decrypt(cookie)) as { userId: string; isAdmin: boolean; expiresAt: Date } | null;

  if (!session?.userId) {
    return { isAuth: false, userId: null, isAdmin: false };
  }

  return { isAuth: true, userId: session.userId, isAdmin: session.isAdmin };
};

const mergeCartsAndOrders = async (userId: string | null) => {
  const cookieStore = await cookies();
  const tempId: string | null = cookieStore.get("tempId")?.value || null;

  if (tempId && userId) {
    await pool.execute(
      `
      INSERT INTO carts (userId, productId, name, cost, imageSrc, amount)
      SELECT *
      FROM (
        SELECT ? AS userId, productId, name, cost, imageSrc, amount
        FROM carts
        WHERE userId = ?
      ) AS src
      ON DUPLICATE KEY UPDATE amount = carts.amount + src.amount
      `,
      [userId, tempId],
    );

    await pool.execute(
      `
        UPDATE orders
        SET clientId = ?
        WHERE clientId = ?
      `,
      [userId, tempId],
    );

    await pool.execute("DELETE FROM carts WHERE userId = ?", [tempId]);
    cookieStore.delete("tempId");
  }
};

export const loginUser = async (prevState: LoginState | undefined, formData: FormData) => {
  try {
    const name = formData.get("name");
    const password = formData.get("password")?.toString();
    const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);

    if (!existingUser.length) {
      return {
        error: "Пользователь не найден",
        formData: {
          name: formData.get("name") as string,
          password: formData.get("password") as string,
        },
      };
    }

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
    await mergeCartsAndOrders(existingUser[0].id);

    return {
      message: `Здравствуйте, ${name}`,
      formData: {
        name: formData.get("name") as string,
        password: formData.get("password") as string,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
};

export async function getCurrentUser() {
  const session = await verifySession();
  let needRefresh = false;

  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const payload = await decrypt(cookie);
  const expiresAt = payload?.expiresAt as string;

  if (expiresAt) {
    const expires = new Date(expiresAt);
    if ((expires.getTime() - Date.now()) / 1000 < 50) {
      needRefresh = true;
    }
  }

  const sql = "SELECT * FROM users WHERE id = ?";

  const [results] = await pool.execute<RowDataPacket[]>(sql, [session.userId]);

  if (!results.length) {
    return null;
  }

  const user = results[0] as Omit<UserType, "password">;
  const { id, name, isAdmin, avatar } = user;

  return {
    id,
    name,
    isAdmin,
    avatar,
    needRefresh,
  };
}
