"use server";

import { pool } from "./database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CartType, UpdateUserState, UpdateCartState, UserType, LoginState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { loginUser } from "@/lib/authActions";
import { cookies } from "next/headers";

// export const updateUser = async (
//   id: number,
//   prevState: UpdateUserState,
//   formData: FormData,
// ) => {
//   try {
//     const [user] = await pool.execute<RowDataPacket[]>(
//       "SELECT * FROM users WHERE id = ?",
//       [id],
//     );

//     const amount = formData.get("amount");
//     const product: CartType =
//       JSON.parse(formData.get("product") as string) ||
//       prevState.formData.product;
//     const avatar = formData.get("avatar") || user[0].avatar;
//     const isCart = prevState.isCart || formData.get("isCart");

//     const existingItem = user[0].cart.find(
//       (item: CartType) => item.id === product.id,
//     );

//     const updatedCart = existingItem
//       ? user[0].cart.map((item: CartType) =>
//           Number(item.id) === Number(product.id)
//             ? {
//                 ...item,
//                 amount: isCart
//                   ? Number(amount)
//                   : Number(item.amount) + Number(amount),
//               }
//             : item,
//         )
//       : [
//           ...user[0].cart,
//           {
//             id: product.id,
//             name: product.name,
//             cost: product.cost,
//             imageSrc: product.imageSrc,
//             amount: Number(amount),
//           },
//         ];

//     const sql = "UPDATE users SET cart = ?, avatar = ? WHERE id = ?";
//     await pool.execute<ResultSetHeader>(sql, [
//       JSON.stringify(updatedCart),
//       avatar,
//       id,
//     ]);
//     revalidatePath("/cart");

//     return {
//       id,
//       message: "Товар успешно добавлен в корзину",
//       errors: {},
//       formData: {
//         amount: Number(amount),
//         product: product,
//         avatar,
//       },
//     };
//   } catch (err) {
//     console.error(err);
//     return {
//       id: null,
//       message: "Ошибка при добавлении товара в корзину",
//       errors: {},
//       formData: {},
//     };
//   }
// };

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

  const [existingUser] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);

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

    const [result] = await pool.execute<ResultSetHeader>(sql, [name, hashedPassword, false]);

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
  formData: FormData
): Promise<UpdateCartState> => {
  try {
    const cart: CartType = JSON.parse(formData.get("cart") as string) || prevState.formData?.cart;
    const { userId, productId, name, cost, imageSrc } = cart;
    const amount = Number(formData.get("amount"));
    const fromCart = formData.get("fromCart") === "true" || prevState.fromCart;

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

    await pool.execute<ResultSetHeader>(sql, [userId, productId, name, cost, imageSrc, amount]);

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
