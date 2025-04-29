"use client";
import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import { useLogoutUserMutation, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import Link from "next/link";
import style from "./products.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const ProductsList = () => {
  const { data, isError, isLoading, isSuccess } = useGetProductsQuery(10);

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
      <section className={style.products}>
        <h2>Популярные товары</h2>
        <ul className={style.list}>
          {data.map((product) => (
            <li key={product.id} className={style.product}>
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  className={style.img}
                  width={230}
                  height={180}
                  priority={false}
                />
                <h3>{product.name}</h3>
                <p>{product.cost.toLocaleString("ru-RU")} ₽</p>
              </Link>
              <button>В корзину</button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return null;
};
