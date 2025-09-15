"use client";

import style from "./cart.module.css";
import { deleteProduct } from "@/lib/usersActions";

export default function DeleteForm({ id, productId }: { id: number; productId: number }) {
  const deleteProductWithId = deleteProduct.bind(null, id);

  const handleClick = () => {
    const bc = new BroadcastChannel("cart");
    bc.postMessage({
      type: "delete",
      productId: productId,
    });
    bc.close();
  };

  return (
    <form action={deleteProductWithId}>
      <button className={style.deleteBtn} onClick={handleClick}>
        Удалить
      </button>
    </form>
  );
}
