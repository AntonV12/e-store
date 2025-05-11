"use client";

import Link from "next/link";
import style from "../styles/layout.module.css";
import CartIcon from "@/public/cart2.svg";
import LoginIcon from "@/public/person-circle.svg";
import XIcon from "@/public/x.svg";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useLogoutUserMutation } from "@/lib/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { Tooltip } from "./Tooltip";
import { useState } from "react";

export default function SignLinks() {
  const { data: currentUser, isLoading, isSuccess, isError, refetch } = useGetCurrentUserQuery();
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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Произошла ошибка</div>;
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
              <span
                onMouseEnter={() => setIsShowTooltip(true)}
                onMouseLeave={() => setIsShowTooltip(false)}
                onClick={handleLogout}
              >
                <XIcon />
              </span>
              {isShowTooltip && <Tooltip children="Выход" />}
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
