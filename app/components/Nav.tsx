"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/layout.module.css";
import { SearchForm } from "./SearchForm";
import ListIcon from "@/public/list.svg";
import CartIcon from "@/public/cart2.svg";
import LoginIcon from "@/public/person-circle.svg";
import XIcon from "@/public/x.svg";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useLogoutUserMutation } from "@/lib/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { UserType } from "@/lib/types/types";
import { Tooltip } from "./Tooltip";
import { useState } from "react";

export const Nav = () => {
  const pathname = usePathname();
  const { data: currentUser, isLoading, refetch } = useGetCurrentUserQuery();
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();
  const [isShowTooltip, setIsShowTooltip] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      await refetch();
      router.push("/");
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  return (
    <nav className={styles.nav}>
      <Link className={styles.logo} href="/">
        My Store
      </Link>
      <div className={styles.menu}>
        <button className={styles.button}>
          <ListIcon />
          <span>Категории</span>
        </button>
      </div>

      <SearchForm />

      <div className={styles.links}>
        <Link className={styles.link} href="cart">
          <CartIcon />
          <p>Корзина</p>
          <span>2</span>
        </Link>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : currentUser ? (
          <>
            <div className={styles.link}>
              <LoginIcon />
              <p>{currentUser.name}</p>
              <span
                onMouseEnter={() => setIsShowTooltip(true)}
                onMouseLeave={() => setIsShowTooltip(false)}
                onClick={handleLogout}
              >
                <XIcon />
              </span>
              {isShowTooltip && <Tooltip children="Выход" />}
            </div>
          </>
        ) : (
          <Link className={styles.link} href="/login">
            <LoginIcon />
            <p>Вход</p>
          </Link>
        )}
      </div>
    </nav>
  );
};
