"use client";

import style from "./cart.module.css";
import { useState, startTransition } from "react";
import { useActionState } from "react";
import { updateUserCart } from "@/lib/usersActions";
import { UpdateCartState, CartType } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";

export default function CartItemForm({
  product,
  userId,
}: {
  product: CartType;
  userId: number;
}) {
  const initialState: UpdateCartState = {
    id: userId,
    message: null,
    errors: {},
    formData: {
      cart: {
        id: product.productId,
        name: product.name,
        cost: product.cost,
        imageSrc: product.imageSrc,
      },
    },
    fromCart: true,
  };

  const [amount, setAmount] = useState<number>(product.amount);
  const updateUserCartWithId = updateUserCart.bind(null, userId);
  const [state, formAction] = useActionState<UpdateCartState, FormData>(
    updateUserCartWithId,
    initialState,
  );

  const debouncedSubmit = useDebouncedCallback(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.set("amount", amount);
      formAction(formData);
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
      <input type="text" value={amount} onChange={handleAmountChange} />
      <button type="button" onClick={handleAmountIncrease}>
        +
      </button>
    </div>
  );
}
