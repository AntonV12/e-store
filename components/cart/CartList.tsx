"use client";

import { CartType } from "@/lib/types";
import style from "./cart.module.css";
import CartItem from "./CartItem";
import Link from "next/link";

export default function CartList({ userCart, userId }: { userCart: CartType[]; userId: string | null }) {
  const total: number = userCart.reduce((sum, product) => {
    return sum + product.cost * product.amount;
  }, 0);

  if (!userCart.length) {
    return <p>Корзина пуста</p>;
  }

  return (
    <>
      <ul className={style.list}>
        {userCart.map((product: CartType) => {
          return <CartItem key={product.productId} product={product} userId={userId} />;
        })}
      </ul>
      <div className={style.total}>
        {total ? (
          <p>
            <strong>Сумма заказа: {total.toLocaleString()} ₽</strong>
          </p>
        ) : null}

        <button className={style.order}>
          <Link href="/order">Оформить заказ</Link>
        </button>
      </div>
    </>
  );
}
