"use client";

import style from "./cart.module.css";
import { deleteProduct } from "@/lib/usersActions";
import { startTransition } from "react";
import { CartType } from "@/lib/types";

export default function DeleteForm({
  id,
  productId,
  setCart,
}: {
  id: number;
  productId: number;
  setCart: React.Dispatch<React.SetStateAction<CartType[]>>;
}) {
  const deleteProductWithId = deleteProduct.bind(null, id);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      if (id) {
        deleteProductWithId();
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart: CartType[] = JSON.parse(savedCart);
          const updatedCart = parsedCart.filter((item) => item.productId !== productId);
          if (updatedCart.length) {
            localStorage.setItem("cart", JSON.stringify(updatedCart));
          } else {
            localStorage.removeItem("cart");
          }
          const cartUpdateEvent = new CustomEvent("cartUpdated");
          window.dispatchEvent(cartUpdateEvent);
          setCart(updatedCart);
        }
      }
    });
  };

  return (
    <form /* action={deleteProductWithId} */ onSubmit={onSubmit}>
      <button className={style.deleteBtn}>Удалить</button>
    </form>
  );
}
