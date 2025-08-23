import style from "./cart.module.css";
import { CartType, UserType } from "@/lib/types";
import CartItem from "./CartItem";
import Link from "next/link";
import { CartSkeleton } from "@/components/skeletons/skeletons";
import { getCurrentUser } from "@/lib/authActions";

export default async function Cart() {
  const currentUser: Omit<UserType, "password"> | null = await getCurrentUser();
  const total = currentUser?.cart.reduce((acc, item) => acc + item.cost * item.amount, 0) || 0;

  if (!currentUser) return;

  return (
    <section className={style.cart}>
      {currentUser?.cart.length ? (
        <>
          <ul className={style.list}>
            {currentUser?.cart.map((product: CartType) => {
              return <CartItem key={product.id} product={product} userId={currentUser.id!} />;
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
