"use client";

import Link from "next/link";
import style from "./SignLinks.module.css";
import LoginIcon from "@/public/person-circle.svg";
import CartIcon from "@/public/cart2.svg";
import { UserType, CartType } from "@/lib/types";
import { updateSession } from "@/lib/sessions";
import { useState, useEffect, useCallback } from "react";

export default function SignLinksClient({ currentUser }: { currentUser: Omit<UserType, "password"> }) {
  const [cartLength, setCartLength] = useState<number>(0);

  const updateCartLength = useCallback(() => {
    const userCartLength = currentUser?.cart.length || 0;
    const savedCart: CartType[] = JSON.parse(localStorage.getItem("cart") as string) || [];
    setCartLength(savedCart.length + userCartLength);
  }, [currentUser]);

  useEffect(() => {
    updateCartLength();

    window.addEventListener("cartUpdated", updateCartLength);

    return () => {
      window.removeEventListener("cartUpdated", updateCartLength);
    };
  }, [updateCartLength]);

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
        <Link className={style.link} href="/login">
          <LoginIcon />
          <p>Вход</p>
        </Link>
      )}
    </div>
  );
}
