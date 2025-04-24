"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/layout.module.css";
import { SearchForm } from "./SearchForm";
import ListIcon from "@/public/list.svg";
import HeartIcon from "@/public/heart.svg";
import CartIcon from "@/public/cart2.svg";
import LoginIcon from "@/public/person-circle.svg";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} href="/">
        My Store
      </Link>
      <div className={styles.logoBlock}>
        <button className={styles.button}>
          <ListIcon />
          <span>Каталог</span>
        </button>
      </div>

      <SearchForm />

      <div className={styles.links}>
        <Link className={styles.link} href="favorites">
          <HeartIcon />
          <p>Избранное</p>
        </Link>
        <Link className={styles.link} href="cart">
          <CartIcon />
          <p>Корзина</p>
        </Link>
        <Link className={styles.link} href="login">
          <LoginIcon />
          <p>Войти</p>
        </Link>
      </div>
    </nav>
  );
};
