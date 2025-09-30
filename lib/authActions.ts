"use server";

import { pool } from "@/lib/database";
import { CartType, LoginState, UserType } from "@/lib/types";
import { RowDataPacket } from "mysql2";
import { createSession, decrypt, deleteSession } from "@/lib/sessions";
import bycript from "bcryptjs";
import { cookies } from "next/headers";
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
  const connection = await pool.getConnection();

  if (tempId && userId) {
    await connection.beginTransaction();

    try {
      await connection.execute(
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

      await connection.execute(
        `
        UPDATE orders
        SET clientId = ?
        WHERE clientId = ?
      `,
        [userId, tempId],
      );

      await connection.execute("DELETE FROM carts WHERE userId = ?", [tempId]);
      await connection.commit();
      cookieStore.delete("tempId");
    } catch (err) {
      await connection.rollback();
      console.error(err);
    } finally {
      connection.release();
    }
  }
};

export const loginUser = async (prevState: LoginState | undefined, formData: FormData): Promise<LoginState> => {
  try {
    const name = formData.get("name");
    const password = formData.get("password")?.toString();
    const [existingUser] = await pool.execute<UserType & RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);

    if (!existingUser.length) {
      return {
        error: "Пользователь не найден",
        formData: {
          name: formData.get("name") as string,
          password: formData.get("password") as string,
        },
      };
    }

    const [cart] = await pool.execute<CartType[] & RowDataPacket[]>("SELECT * FROM carts WHERE userId = ?", [
      existingUser[0].id,
    ]);

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
        cart: cart,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
};

export async function getCurrentUser() {
  try {
    const session = await verifySession();
    if (!session?.userId) {
      console.log("No valid session found");
      return null;
    }

    let needRefresh = false;

    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get("session")?.value;
      const payload = await decrypt(cookie);
      const expiresAt = payload?.expiresAt as string;

      if (expiresAt) {
        const expires = new Date(expiresAt);
        if ((expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 1) {
          needRefresh = true;
        }
      }
    } catch (err) {
      console.error("Error processing cookies:", err);
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
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
  }
}

export const logoutUser = async () => {
  await deleteSession();
  return { message: "Успешный выход из системы" };
};
