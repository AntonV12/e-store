"use client";

import { CartType, UpdateCartState } from "@/lib/types";
import style from "./cart.module.css";
import CartItem from "./CartItem";
import Link from "next/link";
import { useState, useEffect, startTransition, useActionState } from "react";
import { CartSkeleton } from "@/components/skeletons/skeletons";
import { updateUserCart } from "@/lib/usersActions";

export default function CartList({ userCart, userId }: { userCart: CartType[]; userId: number }) {
  const [cart, setCart] = useState<CartType[]>(userCart);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const savedCart: CartType[] = JSON.parse(localStorage.getItem("cart") as string) || [];
    if (savedCart && userId) {
      startTransition(() => {
        savedCart.forEach((item) => {
          const initialState: UpdateCartState = {
            message: "",
            error: null,
            formData: {
              cart: {
                id: null,
                userId: userId,
                productId: item.productId,
                name: item.name,
                cost: item.cost,
                imageSrc: item.imageSrc,
                amount: item.amount,
              },
            },
          };
          const formData = new FormData();
          formData.append("cart", JSON.stringify(item));
          formData.append("amount", item.amount.toString());
          updateUserCart(userId, initialState, formData);
        });
        localStorage.removeItem("cart");
      });
    }
    const updatedCart = [...userCart, ...savedCart];
    setCart(updatedCart);
    setTotal(updatedCart.reduce((acc, item) => acc + item.cost * item.amount, 0));
    setIsLoading(false);
  }, [userId, userCart]);

  if (isLoading) return <CartSkeleton />;

  if (cart.length === 0 && !isLoading) return <p>Корзина пуста</p>;

  return (
    <>
      <ul className={style.list}>
        {cart.map((product: CartType) => {
          return <CartItem key={product.productId} product={product} userId={userId} setCart={setCart} />;
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
