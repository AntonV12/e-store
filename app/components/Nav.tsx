"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/layout.module.css";
import { SearchForm } from "./SearchForm";
import ListIcon from "@/public/list.svg";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.logoBlock}>
        <Link className={styles.logo} href="/">
          My Store
        </Link>
        <button className={styles.button}>
          <ListIcon />
          Каталог
        </button>
      </div>

      <SearchForm />

      <div className={styles.links}>
        <Link className={styles.link} href="favovites">
          Избранное
        </Link>
        <Link className={styles.link} href="cart">
          Корзина
        </Link>
        <Link className={styles.link} href="login">
          Войти
        </Link>
      </div>
    </nav>
  );
};
