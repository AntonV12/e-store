"use client";

import { updateUser } from "@/lib/usersActions";
import { useActionState, useState } from "react";
import Amount from "@/components/amount/Amount";
import style from "./product.module.css";
import { ProductType, UpdateUserState } from "@/lib/types";
import Message from "@/components/message/Message";

export default function Form({ product, userId }: { product: ProductType; userId: number }) {
  const initialState: UpdateUserState = {
    id: userId,
    message: null,
    errors: {},
    formData: {
      product: {
        id: product.id,
        name: product.name,
        cost: product.cost,
        imageSrc: product.imageSrc[0],
        amount: 1,
      },
      avatar: "",
    },
  };
  const updateUserWithId = updateUser.bind(null, userId);
  const [state, formAction] = useActionState<UpdateUserState, FormData>(updateUserWithId, initialState);
  const [amount, setAmount] = useState<number>(1);

  return (
    <form action={formAction}>
      <h2 className={style.priceInput}>{product.cost.toLocaleString("ru-RU")} ₽</h2>
      <Amount value={amount} setAmount={setAmount} />
      <input
        type="text"
        name="product"
        hidden
        defaultValue={JSON.stringify({
          id: product.id,
          name: product.name,
          cost: product.cost,
          imageSrc: product.imageSrc[0],
        })}
      />
      <button type="submit">В корзину</button>
      {state.message && <Message text={state.message} onHide={() => (state.message = "")} />}
    </form>
  );
}
