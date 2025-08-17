"use client";

import style from "./cart.module.css";
import { useState, useActionState } from "react";
import { updateUser } from "@/lib/usersActions";
import { UpdateUserState, CartType } from "@/lib/types";

export default function CartItemForm({ product, userId }: { product: CartType; userId: number }) {
  const initialState: UpdateUserState = {
    id: userId,
    message: null,
    errors: {},
    formData: {
      product: product,
    },
    isCart: true,
  };
  const [amount, setAmount] = useState<number>(product.amount);
  const updateUserWithId = updateUser.bind(null, userId);
  const [state, formAction] = useActionState<UpdateUserState, FormData>(updateUserWithId, initialState);

  const handleAmountDecrease = async () => setAmount(amount > 1 ? amount - 1 : amount);
  const handleAmountIncrease = async () => setAmount(amount + 1);
  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 1) return;
    setAmount(+e.target.value);
  };

  return (
    <form action={formAction} className={style.amount}>
      <button type="submit" onClick={handleAmountDecrease}>
        -
      </button>
      <input type="text" name="amount" value={amount} onChange={handleAmountChange} />
      <input type="text" hidden name="isCart" defaultValue="true" />
      <button type="submit" onClick={handleAmountIncrease}>
        +
      </button>
    </form>
  );
}
