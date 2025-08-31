"use client";

import style from "./cart.module.css";
import React, { useState, startTransition } from "react";
import { useActionState } from "react";
import { updateUserCart } from "@/lib/usersActions";
import { UpdateCartState, CartType } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";

export default function CartItemForm({
  product,
  userId,
  amount,
  setAmount,
}: {
  product: CartType;
  userId: number;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
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
      },
    },
    fromCart: true,
  };

  // const [amount, setAmount] = useState<number>(product.amount);
  const updateUserCartWithId = updateUserCart.bind(null, userId);
  const [state, formAction] = useActionState<UpdateCartState, FormData>(updateUserCartWithId, initialState);

  const debouncedSubmit = useDebouncedCallback(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.set("amount", amount.toString());
      formData.set("fromCart", "true");

      if (userId) {
        formAction(formData);
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart: CartType[] = JSON.parse(savedCart);
          const existingCart = parsedCart.find((item) => item.productId === product.productId);
          if (existingCart) {
            existingCart.amount = amount;
            localStorage.setItem("cart", JSON.stringify(parsedCart));
          } else {
            parsedCart.push({ ...product, amount });
            localStorage.setItem("cart", JSON.stringify(parsedCart));
          }
        }
      }
    });
  }, 500);

  const handleAmountDecrease = () => {
    setAmount((prev) => {
      const newAmount = prev > 1 ? prev - 1 : prev;
      debouncedSubmit();
      return newAmount;
    });
  };

  const handleAmountIncrease = () => {
    setAmount((prev) => {
      const newAmount = prev + 1;
      debouncedSubmit();
      return newAmount;
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +e.target.value;
    if (val < 1) return;
    setAmount(val);
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
