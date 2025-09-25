"use client";

import style from "./comments.module.css";
import { ProductType, UpdateCommentsState } from "@/lib/types";
import { useActionState } from "react";
import { updateComments } from "@/lib/productsActions";

const AddCommentForm = ({ product, userId }: { product: ProductType; userId: string | null }) => {
  const initialState: UpdateCommentsState = {
    error: "",
    message: "",
    formData: { text: "" },
  };
  const [, formAction, isPending] = useActionState<UpdateCommentsState, FormData>(
    updateComments.bind(null, product.id),
    initialState,
  );

  return (
    <form action={formAction}>
      <textarea className={style.textarea} name="text" placeholder="Оставить комментарий"></textarea>
      <input type="text" hidden name="author" defaultValue={userId || ""} />
      <button type="submit" disabled={isPending}>
        Отправить
      </button>
    </form>
  );
};

export default AddCommentForm;
