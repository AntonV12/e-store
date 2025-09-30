"use client";

import style from "./cart.module.css";
import React, { startTransition } from "react";
import { updateUserCart } from "@/lib/usersActions";
import { UpdateCartState, CartType } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";

export default function CartItemForm({
  product,
  userId,
  amount,
  setAmountAction,
}: {
  product: CartType;
  userId: string | null;
  amount: number;
  setAmountAction: React.Dispatch<React.SetStateAction<number>>;
}) {
  const initialState: UpdateCartState = {
    message: "",
    error: "",
    formData: {
      cart: {
        id: null,
        userId: userId,
        productId: product.productId,
        name: product.name,
        cost: product.cost,
        imageSrc: product.imageSrc,
        amount: 1,
        rating: 0,
      },
    },
    fromCart: true,
  };

  const debouncedSubmit = useDebouncedCallback(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.set("amount", amount.toString());
      formData.set("fromCart", "true");
      updateUserCart(userId, initialState, formData);
    });
  }, 500);

  const handleAmountDecrease = () => {
    setAmountAction((prev) => {
      const newAmount = prev > 1 ? prev - 1 : prev;
      debouncedSubmit();
      return newAmount;
    });
  };

  const handleAmountIncrease = () => {
    setAmountAction((prev) => {
      const newAmount = prev + 1;
      debouncedSubmit();
      return newAmount;
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val < 1) return;
    setAmountAction(val);
    debouncedSubmit();
  };

  return (
    <div className={style.amount}>
      <button type="button" onClick={handleAmountDecrease}>
        -
      </button>
      <input type="text" name="amount" value={amount} onChange={handleAmountChange} />
      <button type="button" onClick={handleAmountIncrease}>
        +
      </button>
    </div>
  );
}
