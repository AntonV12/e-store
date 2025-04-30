"use client";
import style from "./comments.module.css";
import { ProductType } from "@/lib/types/types";
import { useUpdateProductMutation } from "@/lib/features/products/productsApiSlice";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { nanoid } from "@reduxjs/toolkit";

export const AddCommentForm = ({ product }: { product: ProductType }) => {
  const [updateProduct, { isLoading, isSuccess, isError }] = useUpdateProductMutation();
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUserLoading) return;

    if (isUserSuccess) {
      if (!currentUser) return;

      const form = e.currentTarget;
      const formData = new FormData(form);
      const now = new Date();
      const year = now.getFullYear();
      const month = +(now.getMonth() + 1) > 10 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1);
      const day = +now.getDate() > 10 ? now.getDate() : "0" + now.getDate();

      const commentText = formData.get("text") as string;
      if (!commentText) return;

      const newComment = {
        id: nanoid(),
        text: commentText,
        date: `${day}.${month}.${year}`,
        author: currentUser?.name,
      };

      const updatedComments = [...product.comments, newComment];
      const updatedProduct = { ...product, comments: updatedComments };

      try {
        await updateProduct(updatedProduct).unwrap();
        form.reset();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <form method="POST" onSubmit={handleAddComment}>
      <textarea className={style.textarea} name="text" placeholder="Оставить комментарий"></textarea>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
};
