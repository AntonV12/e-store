"use client";

import { updateUserCart } from "@/lib/usersActions";
import { useActionState, useState, useEffect, startTransition } from "react";
import Amount from "@/components/amount/Amount";
import style from "./product.module.css";
import { ProductType, UpdateCartState, CartType } from "@/lib/types";
import { useMessage } from "@/lib/messageContext";

export default function Form({ product, userId }: { product: ProductType; userId: number }) {
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.set("amount", amount.toString());

      if (userId) {
        formAction(formData);
      } else {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const parsedCart: CartType[] = JSON.parse(savedCart);
          const existingCart = parsedCart.find((item) => item.productId === product.id);

          if (existingCart) {
            existingCart.amount += amount;
            localStorage.setItem("cart", JSON.stringify(parsedCart));
          } else {
            if (!state.formData?.cart) return;
            parsedCart.push({ ...state.formData?.cart, amount });
            localStorage.setItem("cart", JSON.stringify(parsedCart));
          }
        } else {
          localStorage.setItem("cart", JSON.stringify([{ ...state.formData?.cart, amount }]));
        }

        const cartUpdateEvent = new CustomEvent("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        setAmount(1);
        setMessage(`${product.name} добавлен в корзину`);
      }
    });
  };

  return (
    <>
      <form /* action={formAction} */ onSubmit={onSubmit}>
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
