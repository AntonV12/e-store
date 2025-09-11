"use client";

import Link from "next/link";
import style from "./SignLinks.module.css";
import LoginIcon from "@/public/person-circle.svg";
import CartIcon from "@/public/cart2.svg";
import PackageIcon from "@/public/package.svg";
import { UserType, CartType } from "@/lib/types";
import { updateSession } from "@/lib/sessions";
import { useState, useEffect, useCallback } from "react";

export default function SignLinksClient({
  currentUser,
  cartLength,
  ordersLength,
}: {
  currentUser: Omit<UserType, "password">;
  cartLength: number;
  ordersLength: number;
}) {
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.needRefresh) {
      updateSession();
    }
  }, [currentUser, currentUser?.needRefresh]);

  return (
    <div className={style.links}>
      <Link className={style.link} href="/cart">
        <CartIcon />
        <p>Корзина</p>
        {cartLength && cartLength > 0 ? <span>{cartLength}</span> : null}
      </Link>
      {currentUser ? (
        <Link className={style.link} href="/profile">
          <LoginIcon />
          <p>{currentUser.name}</p>
        </Link>
      ) : (
        <>
          <Link className={style.link} href="/login">
            <LoginIcon />
            <p>Вход</p>
          </Link>
          <Link className={style.link} href="/orders">
            <PackageIcon />
            {ordersLength && ordersLength > 0 ? (
              <span>{ordersLength}</span>
            ) : null}
            <p>Заказы</p>
          </Link>
        </>
      )}
    </div>
  );
}
