"use client";

import styles from "../styles/layout.module.css";
import SearchIcon from "@/public/search.svg";

export const SearchForm = () => {
  return (
    <form className={styles.searchForm}>
      <input type="search" className={styles.input} />
      <button type="submit" className={styles.button}>
        <SearchIcon />
      </button>
    </form>
  );
};
