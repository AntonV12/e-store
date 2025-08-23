"use client";

import { useActionState } from "react";
import CheckIcon from "@/public/check.svg";
import style from "./order.module.css";
import { updateOrder } from "@/lib/ordersActions";
import { UpdateOrderState } from "@/lib/types";

export default function Form({ isDone, id }: { isDone: "0" | "1"; id: number }) {
  const initialState: UpdateOrderState = {
    error: null,
    message: "",
    formData: { isDone, id },
  };
  const [state, formAction] = useActionState<UpdateOrderState, FormData>(updateOrder, initialState);

  return (
    <form action={formAction}>
      <button type="submit" name="isDone" className={style.checkButton} value={isDone.toString()}>
        <CheckIcon className={style.checkIcon} style={{ fill: isDone ? "green" : "grey" }} />
      </button>
    </form>
  );
}
