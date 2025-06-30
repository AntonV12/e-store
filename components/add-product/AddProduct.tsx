"use client";

import style from "./add-product.module.css";
import { useCreateProductMutation } from "@/lib/features/products/productsApiSlice";
import { setMessage } from "@/lib/features/message/messageSlice";
import { useAppDispatch } from "@/lib/hooks";
import TextEditor from "@/components/editor/TextEditor";
import { useRef } from "react";

export default function AddProduct() {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const dispatch = useAppDispatch();
  const editorRef = useRef<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      const description = editorRef.current.getContent() || "";
      formData.append("description", description);

      const responce = await createProduct(formData);

      if ("error" in responce) {
        throw new Error("Ошибка записи");
      }

      dispatch(setMessage(`Товар ${formData.get("name")} успешно добавлен`));
      form.reset();
      if (editorRef.current) {
        editorRef.current.clearContent();
      }
    } catch (error) {
      console.error(error);
      dispatch(setMessage("Произошла ошибка при добавлении товара"));
    }
  };

  return (
    <div className={style.container}>
      <h2>Добавить новый товар</h2>
      <form className={style.form} method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Название товара:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="category">Категория:</label>
          <input type="text" id="category" name="category" required />
        </div>
        <div>
          <label htmlFor="image">Изображение:</label>
          <input type="file" id="image" name="image" accept="image/*" required />
        </div>
        <div>
          <label htmlFor="cost">Цена:</label>
          <input type="number" id="cost" name="cost" required />
        </div>
        <div>
          <label>Описание:</label>
          <TextEditor ref={editorRef} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Добавить товар"}
        </button>
      </form>
    </div>
  );
}
