"use client";

import styles from "@/styles/layout.module.css";
import ListIcon from "@/public/list.svg";

export const SearchForm = ({
  value,
  setValue,
  toggleCategories,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  toggleCategories: () => void;
}) => {
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.searchForm}>
      <div className={styles.menu}>
        <button className={styles.button} onClick={toggleCategories}>
          <ListIcon />
          <span>Категории</span>
        </button>
      </div>
      <input type="search" name="search" className={styles.input} value={value} onChange={handleSearch} />
    </div>
  );
};
