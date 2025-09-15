"use client";

import Link from "next/link";
import style from "./SignLinks.module.css";
import LoginIcon from "@/public/person-circle.svg";
import CartIcon from "@/public/cart2.svg";
import PackageIcon from "@/public/package.svg";
import { UserType, CartType } from "@/lib/types";
import { updateSession } from "@/lib/sessions";
import { useEffect, useState, useMemo } from "react";

export default function SignLinksClient({
  currentUser,
  cart: initialCart,
  ordersLength,
}: {
  currentUser: Omit<UserType, "password">;
  cart: CartType[];
  ordersLength: number | null;
}) {
  const [cart, setCart] = useState<CartType[]>(initialCart || []);
  const cartLength = useMemo(() => cart.length, [cart]);

  useEffect(() => {
    if (currentUser?.needRefresh) {
      updateSession();
    }
  }, [currentUser?.needRefresh]);

  useEffect(() => {
    const bc = new BroadcastChannel("cart");

    bc.onmessage = (event) => {
      if (event.data.type === "update") {
        const { productId, amount } = event.data;

        setCart((prev) => {
          const exists = prev.some((item) => item.productId === productId);

          if (exists) {
            return prev;
          } else {
            return [...prev, { productId, amount: amount || 1 }];
          }
        });
      } else if (event.data.type === "delete") {
        const { productId } = event.data;

        setCart((prev) =>
          prev.filter((item) => {
            return item.productId !== productId;
          }),
        );
      }
    };

    return () => bc.close();
  }, []);

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
            {ordersLength && ordersLength > 0 ? <span>{ordersLength}</span> : null}
            <p>Заказы</p>
          </Link>
        </>
      )}
    </div>
  );
}
