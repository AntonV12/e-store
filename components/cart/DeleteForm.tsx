"use client";

import style from "./cart.module.css";
import { deleteProduct } from "@/lib/usersActions";
import { startTransition } from "react";
import { CartType } from "@/lib/types";

export default function DeleteForm({
  id,
  productId,
}: {
  id: number;
  productId: number;
}) {
  const deleteProductWithId = deleteProduct.bind(null, id);

  return (
    <form action={deleteProductWithId}>
      <button className={style.deleteBtn}>Удалить</button>
    </form>
  );
}
