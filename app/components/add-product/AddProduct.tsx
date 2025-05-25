"use client";

import style from "./add-product.module.css";
import { useCreateProductMutation } from "@/lib/features/products/productsApiSlice";
import { ProductType } from "@/lib/types/types";
import { setMessage } from "@/lib/features/message/messageSlice";
import { useAppDispatch } from "@/lib/hooks";

export default function AddProduct() {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const costValue = formData.get("cost");
    const cost = costValue ? Number(costValue) : 0;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const newProduct = {
          id: null,
          name,
          category,
          viewed: 0,
          rating: [],
          cost,
          imageSrc: base64String,
          description,
          comments: [],
        } as ProductType;
        await createProduct(newProduct);
      };
      reader.readAsDataURL(imageFile);
    }
    dispatch(setMessage(`Товар ${name} успешно добавлен`));
    event.currentTarget.reset();
  };

  return (
    <div className={style.container}>
      <h2>Добавить новый товар</h2>
      <form className={style.form} method="POST" onSubmit={handleSubmit}>
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
          <label htmlFor="description">Описание:</label>
          <textarea id="description" name="description" rows={10} className={style.description} required></textarea>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Добавить товар"}
        </button>
      </form>
    </div>
  );
}
