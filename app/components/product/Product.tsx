"use client";

import Link from "next/link";
import { ProductType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import style from "./product.module.css";
import Image from "next/image";
import { RatingArea } from "@/app/components/rating/Rating";
import { useState } from "react";
import { CommentsList } from "@/app/components/comments/CommentsList";
import { AddCommentForm } from "@/app/components/comments/AddCommentForm";

export default function Product({ id }: { id: number }) {
  const router = useRouter();
  const { data: product, isError, isLoading, isSuccess } = useGetProductByIdQuery(id);
  const [amountValue, setAmountValue] = useState<number>(1);

  const handleAmountDecrease = () => {
    setAmountValue((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAmountIncrease = () => {
    setAmountValue((prev) => prev + 1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 1) return;
    setAmountValue(+e.target.value);
  };

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <section className={style.productCard}>
        <div className={style.container}>
          <Image src={product.imageSrc} alt={product.name} width={280} height={280} priority />
          <div className={style.info}>
            <div className={style.title}>
              <h1>{product.name}</h1>
              <RatingArea />
              <p className={style.rating}>
                Общий рейтинг: {product.rating} <span className={style.star}>&#9733;</span>
              </p>
            </div>
            <div className={style.price}>
              <h2>{product.cost.toLocaleString("ru-RU")} ₽</h2>
              <div className={style.amount}>
                <button onClick={handleAmountDecrease}>-</button>
                <input type="text" value={amountValue} onChange={handleAmountChange} />
                <button onClick={handleAmountIncrease}>+</button>
              </div>
              <button>Купить</button>
            </div>
            <p>{product.description}</p>
          </div>
        </div>

        <CommentsList comments={product.comments} />
        <AddCommentForm product={product} />
      </section>
    );
  }
}
