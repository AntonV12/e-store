"use server";

import { pool } from "./database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  CartType,
  UpdateUserState,
  UpdateCartState,
  UserType,
  LoginState,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { loginUser } from "@/lib/authActions";
import { cookies } from "next/headers";
import path from "path";
import { writeFile } from "fs/promises";

export const createUser = async (prevState: LoginState, formData: FormData) => {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!name || !password || !confirmPassword) {
    return {
      error: "Заполните все поля",
      message: null,
      formData: {
        name: name,
        password: password,
        confirmPassword: confirmPassword,
      },
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Пароли не совпадают",
      message: null,
      formData: {
        name: name,
        password: "",
        confirmPassword: "",
      },
    };
  }

  if (!name.trim() || !password.trim()) {
    return {
      error: "Имя и пароль обязательны",
      message: null,
      formData: {
        name: name,
        password: password,
        confirmPassword: confirmPassword,
      },
    };
  }

  const [existingUser] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE name = ?",
    [name],
  );

  if (existingUser.length > 0) {
    return {
      error: "Пользователь с таким именем уже существует",
      message: null,
      formData: {
        name: name,
        password: password,
        confirmPassword: confirmPassword,
      },
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const sql = `
      INSERT INTO users (name, password, isAdmin)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      name,
      hashedPassword,
      false,
    ]);

    if (result.affectedRows > 0) {
      const prevState = {
        formData: {
          name: name,
          password: password,
        },
      };
      const formData = new FormData();
      formData.append("name", name as string);
      formData.append("password", password as string);

      await loginUser(prevState, formData);

      return {
        error: null,
        message: "Пользователь успешно зарегистрирован",
        formData: {
          name: "",
          password: "",
        },
      };
    }
  } catch (err) {
    console.error(err);
    return {
      error: "Ошибка при регистрации пользователя",
      message: null,
      formData: {},
    };
  }
};

export const updateUserCart = async (
  userId: number,
  prevState: UpdateCartState,
  formData: FormData,
): Promise<UpdateCartState> => {
  try {
    const cart: CartType =
      JSON.parse(formData.get("cart") as string) || prevState.formData?.cart;
    const { userId, productId, name, cost, imageSrc } = cart;
    const amount = Number(formData.get("amount"));
    const fromCart = formData.get("fromCart") === "true" || prevState.fromCart;

    const amountUpdate = fromCart
      ? "amount = VALUES(amount)"
      : "amount = amount + VALUES(amount)";

    const sql = `
      INSERT INTO carts (userId, productId, name, cost, imageSrc, amount)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        ${amountUpdate},
        name = VALUES(name),
        cost = VALUES(cost),
        imageSrc = VALUES(imageSrc)
    `;

    await pool.execute<ResultSetHeader>(sql, [
      userId,
      productId,
      name,
      cost,
      imageSrc,
      amount,
    ]);

    revalidatePath("/cart");
    return {
      error: null,
      message: `${name} добавлен в корзину`,
      formData: {
        cart,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      error: "Ошибка при добавлении товара в корзину",
      message: "",
      formData: {
        cart: prevState.formData?.cart ?? null,
      },
    };
  }
};

export const deleteProduct = async (id: number) => {
  await pool.execute(`DELETE FROM carts WHERE id = ${id}`);
  revalidatePath("/cart");
};

export const updateUser = async (
  prevState: UpdateUserState,
  formData: FormData,
) => {
  const id = prevState?.id;
  const imageFile = formData.get("avatar") as File;
  const dir = path.join(process.cwd(), "uploads");

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
  const filePath = path.join(dir, filename);

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, new Uint8Array(buffer));

  try {
    await pool.execute(`UPDATE users SET avatar = ? WHERE id = ?`, [
      filename,
      id,
    ]);
  } catch (err) {
    console.error(err);
    return {
      error: "Ошибка при обновлении аватара",
      message: null,
      formData: {
        avatar: prevState.formData?.avatar || null,
      },
    };
  }

  revalidatePath("/profile");
};
