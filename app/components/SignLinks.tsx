"use client";

import Link from "next/link";
import style from "../styles/layout.module.css";
import CartIcon from "@/public/cart2.svg";
import LoginIcon from "@/public/person-circle.svg";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { SignLinksSkeleton } from "@/app/components/skeletons/skeletons";

export default function SignLinks() {
  const { data: currentUser, isLoading, isSuccess, isError } = useGetCurrentUserQuery();

  if (isLoading) {
    return <SignLinksSkeleton />;
  }

  if (isSuccess) {
    const cartLength = currentUser?.cart.length;

    return (
      <div className={style.links}>
        <Link className={style.link} href="/cart">
          <CartIcon />
          <p>Корзина</p>
          {cartLength && cartLength > 0 ? <span>{cartLength}</span> : null}
        </Link>
        {currentUser ? (
          <>
            <Link className={style.link} href="/profile">
              <LoginIcon />
              <p>{currentUser.name}</p>
            </Link>
          </>
        ) : (
          <Link className={style.link} href="/login">
            <LoginIcon />
            <p>Вход</p>
          </Link>
        )}
      </div>
    );
  }
}
