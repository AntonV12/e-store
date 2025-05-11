import React from "react";
import style from "./categories.module.css";
import { useGetCategoriesQuery } from "@/lib/features/products/productsApiSlice";

export default function Categories({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: categories, isError, isLoading, isSuccess } = useGetCategoriesQuery();

  if (isError) {
    return (
      <div className={style.categories}>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={style.categories}>
        <h1>Loading...</h1>
      </div>
    );
  }

  const toggleCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  if (isSuccess) {
    return (
      <div className={style.categories}>
        <h3>Категории</h3>
        <ul className={style.list}>
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => toggleCategory(category)}
              className={selectedCategory === category ? style.active : ""}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
