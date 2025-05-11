"use client";
import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import Link from "next/link";
import style from "./products.module.css";
import Image from "next/image";
import { SearchForm } from "../SearchForm";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks";
import Categories from "@/app/components/categories/Categories";

export const ProductsList = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data, isError, isLoading, isSuccess } = useGetProductsQuery({
    limit: 10,
    name: debouncedValue,
    category: selectedCategory,
  });
  const [isShowCategories, setIsShowCategories] = useState(false);

  const toggleCategories = () => {
    setIsShowCategories((prev) => !prev);
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
      <section className={style.products}>
        <SearchForm value={value} setValue={setValue} toggleCategories={toggleCategories} />

        <h2>Популярные товары</h2>
        {data.length === 0 && <p>Товаров не найдено</p>}

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
                  priority
                />
                <h3>{product.name}</h3>
                <p>{product.cost.toLocaleString("ru-RU")} ₽</p>
              </Link>
            </li>
          ))}
        </ul>
        {isShowCategories && (
          <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}
      </section>
    );
  }

  return null;
};
