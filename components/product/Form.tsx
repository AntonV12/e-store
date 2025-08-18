"use client";

import { updateUser, updateUserCart } from "@/lib/usersActions";
import { useActionState, useState, useEffect } from "react";
import Amount from "@/components/amount/Amount";
import style from "./product.module.css";
import { ProductType, UpdateUserState, UpdateCartState } from "@/lib/types";
import Message from "@/components/message/Message";

export default function Form({
  product,
  userId,
}: {
  product: ProductType;
  userId: number;
}) {
  const initialState: UpdateCartState = {
    userId: userId,
    message: null,
    errors: {},
    formData: {
      cart: {
        productId: product.id,
        name: product.name,
        cost: product.cost,
        imageSrc: product.imageSrc[0],
        amount: 1,
      },
    },
  };
  const updateUserCartWithId = updateUserCart.bind(null, userId);
  const [state, formAction] = useActionState<UpdateCartState, FormData>(
    updateUserCartWithId,
    initialState,
  );
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    if (state.message) {
      setAmount(1);
    }
  }, [state.message]);

  return (
    <form action={formAction}>
      <h2 className={style.priceInput}>
        {product.cost.toLocaleString("ru-RU")} ₽
      </h2>
      <Amount value={amount} setAmount={setAmount} />
      <input
        type="text"
        name="cart"
        hidden
        defaultValue={JSON.stringify({
          productId: product.id,
          name: product.name,
          cost: product.cost,
          imageSrc: product.imageSrc[0],
          amount: amount,
        })}
      />
      <button type="submit">В корзину</button>
      {state.message && (
        <Message text={state.message} onHide={() => (state.message = "")} />
      )}
    </form>
  );
}
