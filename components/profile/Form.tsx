"use client";

import { useActionState } from "react";
import CheckIcon from "@/public/check.svg";
import style from "./order.module.css";
import { updateOrder } from "@/lib/ordersActions";
import { UpdateOrderState } from "@/lib/types";

export default function Form({ isDone, id, isAdmin }: { isDone: "0" | "1"; id: number; isAdmin: boolean }) {
  const initialState: UpdateOrderState = {
    error: null,
    message: "",
    formData: { isDone, id },
  };
  const updateOrderWithIsAdmin = updateOrder.bind(null, isAdmin);
  const [, formAction] = useActionState<UpdateOrderState, FormData>(updateOrderWithIsAdmin, initialState);

  return (
    <form action={formAction}>
      <button type="submit" name="isDone" className={style.checkButton} value={isDone.toString()} disabled={!isAdmin}>
        <CheckIcon className={style.checkIcon} style={{ fill: isDone ? "green" : "grey" }} />
      </button>
    </form>
  );
}
