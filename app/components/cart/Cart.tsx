"use client";

import style from "./cart.module.css";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { CartType } from "@/lib/types/types";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CartSkeleton } from "@/app/components/skeletons/skeletons";

export default function Cart() {
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) return;
    setTotal(currentUser?.cart.reduce((acc, item) => acc + item.cost * item.amount, 0));
  }, [currentUser]);

  if (isUserLoading) return <CartSkeleton />;
  if (isUserSuccess) {
    return (
      <section className={style.cart}>
        {currentUser?.cart.length ? (
          <>
            <ul className={style.list}>
              {currentUser?.cart.map((product: CartType) => {
                return <CartItem key={product.id} product={product} currentUser={currentUser} setTotal={setTotal} />;
              })}
            </ul>
            <div className={style.total}>
              <p>
                <strong>Сумма заказа: {total.toLocaleString()} ₽</strong>
              </p>
              <button className={style.order}>
                <Link href="/order">Оформить заказ</Link>
              </button>
            </div>
          </>
        ) : (
          <p>В корзине пусто</p>
        )}
      </section>
    );
  }
}
