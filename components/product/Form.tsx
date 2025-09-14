"use client";

import { updateUserCart } from "@/lib/usersActions";
import { useActionState, useState, useEffect } from "react";
import Amount from "@/components/amount/Amount";
import style from "./product.module.css";
import { ProductType, UpdateCartState } from "@/lib/types";
import { useMessage } from "@/lib/messageContext";

export default function Form({ product, userId }: { product: ProductType; userId: string | null }) {
  const [amount, setAmount] = useState<number>(1);

  const initialState: UpdateCartState = {
    message: "",
    error: null,
    formData: {
      cart: {
        id: null,
        userId: userId,
        productId: product.id,
        name: product.name,
        cost: product.cost,
        imageSrc: product.imageSrc[0],
        amount: 1,
        rating: 0,
      },
    },
  };
  const updateUserCartWithId = updateUserCart.bind(null, userId);
  const [state, formAction] = useActionState<UpdateCartState, FormData>(updateUserCartWithId, initialState);
  const { setMessage } = useMessage();

  useEffect(() => {
    if (state?.message) {
      setAmount(1);
      setMessage(state.message);
    }
  }, [state, setMessage]);

  return (
    <>
      <form action={formAction}>
        <h2 className={style.priceInput}>{product.cost.toLocaleString("ru-RU")} ₽</h2>
        <Amount value={amount} setAmount={setAmount} />
        <input
          type="text"
          name="cart"
          hidden
          defaultValue={JSON.stringify({
            id: null,
            userId: userId,
            productId: product.id,
            name: product.name,
            cost: product.cost,
            imageSrc: product.imageSrc[0],
          })}
        />
        <button type="submit">В корзину</button>
      </form>
    </>
  );
}
