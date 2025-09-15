"use server";

import { pool } from "./database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CartType, UpdateUserState, UpdateCartState, LoginState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { loginUser } from "@/lib/authActions";
import { cookies } from "next/headers";
import path from "path";
import { writeFile, rm } from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";

export const createUser = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const name = (formData.get("name") as string)?.toString();
  const password = (formData.get("password") as string)?.toString();
  const confirmPassword = (formData.get("confirmPassword") as string)?.toString();
  const id: string = nanoid();

  if (!name || !password || !confirmPassword) {
    return {
      error: "Заполните все поля",
      message: "",
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
      message: "",
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
      message: "",
      formData: {
        name: name,
        password: password,
        confirmPassword: confirmPassword,
      },
    };
  }

  const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);

  if (existingUser.length > 0) {
    return {
      error: "Пользователь с таким именем уже существует",
      message: "",
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
      INSERT INTO users (id, name, password, isAdmin, avatar)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [id, name, hashedPassword, false, ""]);

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
        error: "",
        message: "Пользователь успешно зарегистрирован",
        formData: {
          name: "",
          password: "",
        },
      };
    } else {
      return {
        error: "Не удалось создать пользователя",
        message: "",
        formData: {
          name: "",
          password: "",
          confirmPassword: "",
        },
      };
    }
  } catch (err) {
    console.error(err);
    return {
      error: "Ошибка при регистрации пользователя",
      message: "",
      formData: {
        name: "",
        password: "",
        confirmPassword: "",
      },
    };
  }
};

export const updateUserCart = async (
  userId: string | null,
  prevState: UpdateCartState,
  formData: FormData,
): Promise<UpdateCartState> => {
  try {
    const cart: CartType = JSON.parse(formData.get("cart") as string) || prevState.formData?.cart;
    const { /* userId, */ productId, name, cost, imageSrc } = cart;
    const amount = Number(formData.get("amount"));
    const fromCart = formData.get("fromCart") === "true" || prevState.fromCart;
    const cookieStore = await cookies();
    let tempId: string | null = cookieStore.get("tempId")?.value || null;

    if (!userId && !tempId) {
      cookieStore.set("tempId", nanoid(24), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      tempId = cookieStore.get("tempId")?.value || null;

      // return {
      //   error: "Пользователь не найден",
      //   message: "Пользователь не найден",
      //   formData: prevState.formData,
      // };
    }

    const amountUpdate = fromCart ? "amount = VALUES(amount)" : "amount = amount + VALUES(amount)";

    const sql = `
      INSERT INTO carts (userId, productId, name, cost, imageSrc, amount)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        ${amountUpdate},
        name = VALUES(name),
        cost = VALUES(cost),
        imageSrc = VALUES(imageSrc)
    `;

    await pool.execute<ResultSetHeader>(sql, [userId || tempId, productId, name, cost, imageSrc, amount]);

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

export const updateUser = async (prevState: UpdateUserState, formData: FormData): Promise<UpdateUserState> => {
  const id = prevState?.id;
  const imageFile = formData.get("avatar") as File;

  if (imageFile.size > 10 * 1024 * 1024) {
    return {
      id,
      error: "Размер файла не должен превышать 10 МБ",
      message: "",
      formData: prevState.formData,
    };
  }

  const dir = path.join(process.cwd(), "uploads");

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + "-" + imageFile.name.replace(/\s+/g, "_");
  const filePath = path.join(dir, "users", filename);

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const processedImageBuffer = await sharp(buffer)
    .resize(85, 85, {
      fit: "cover",
      position: "center",
    })
    .jpeg({
      quality: 100,
      mozjpeg: true,
    });

  await writeFile(filePath, processedImageBuffer);

  const [oldAvatar] = await pool.execute<RowDataPacket[]>("SELECT avatar FROM users WHERE id = ?", [id]);

  if (oldAvatar[0].avatar) {
    await rm(path.join(dir, "users", oldAvatar[0].avatar));
  }

  try {
    await pool.execute(`UPDATE users SET avatar = ? WHERE id = ?`, [filename, id]);

    revalidatePath("/profile");

    return {
      id,
      error: null,
      message: "Аватар успешно обновлен",
      formData: {
        avatar: filename,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      id,
      error: "Ошибка при обновлении аватара",
      message: null,
      formData: {
        avatar: prevState.formData?.avatar || null,
      },
    };
  }
};

export const fetchUserCart = async (userId: string | null): Promise<{ cart: CartType[]; count: number }> => {
  const cookieStore = await cookies();
  const tempId: string | null = cookieStore.get("tempId")?.value || null;

  if (!userId && !tempId) {
    return { cart: [], count: 0 };
  }

  try {
    const [result] = await pool.execute<CartType[] & RowDataPacket[]>("SELECT * FROM carts WHERE userId = ?", [
      userId ?? tempId,
    ]);

    return { cart: result, count: result.length };
  } catch (err) {
    console.error(err);
    return { cart: [], count: 0 };
  }
};
