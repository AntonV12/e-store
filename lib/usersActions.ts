"use server";

import { pool } from "./database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CartType, UpdateUserState } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const updateUser = async (id: number, prevState: UpdateUserState, formData: FormData) => {
  try {
    const [user] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);

    const amount = formData.get("amount");
    const product: CartType = JSON.parse(formData.get("product") as string) || prevState.formData.product;
    const avatar = formData.get("avatar") || user[0].avatar;
    const isCart = prevState.isCart || formData.get("isCart");

    const existingItem = user[0].cart.find((item: CartType) => item.id === product.id);

    const updatedCart = existingItem
      ? user[0].cart.map((item: CartType) =>
          Number(item.id) === Number(product.id)
            ? { ...item, amount: isCart ? Number(amount) : Number(item.amount) + Number(amount) }
            : item
        )
      : [
          ...user[0].cart,
          {
            id: product.id,
            name: product.name,
            cost: product.cost,
            imageSrc: product.imageSrc,
            amount: Number(amount),
          },
        ];

    const sql = "UPDATE users SET cart = ?, avatar = ? WHERE id = ?";
    await pool.execute<ResultSetHeader>(sql, [JSON.stringify(updatedCart), avatar, id]);
    revalidatePath("/cart");

    return {
      id,
      message: "Товар успешно добавлен в корзину",
      errors: {},
      formData: {
        amount: Number(amount),
        product: product,
        avatar,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      id: null,
      message: "Ошибка при добавлении товара в корзину",
      errors: {},
      formData: {},
    };
  }
};
