"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import styles from "./searchForm.module.css";
import ListIcon from "@/public/list.svg";
import { useState } from "react";
import SearchIcon from "@/public/search.svg";
import Categories from "@/components/categories/Categories";

export default function SearchForm({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isShowCategories, setIsShowCategories] = useState<boolean>(false);

  const toggleShowCategories = () => {
    setIsShowCategories(!isShowCategories);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    // params.set("page", "1");

    if (term) {
      params.set("name", term);
    } else {
      params.delete("name");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={styles.searchForm}>
      <div className={styles.menu}>
        <button className={styles.button} onClick={toggleShowCategories}>
          <ListIcon />
          <span>Категории</span>
        </button>
        {isShowCategories && <Categories categories={categories} />}
      </div>

      <div className={styles.inputBlock}>
        <div className={styles.searchIcon}>
          <SearchIcon className={styles.searchIcon} />
        </div>

        <input
          type="text"
          className={styles.input}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("name")?.toString()}
          placeholder="Поиск..."
        />
      </div>
    </div>
  );
}
