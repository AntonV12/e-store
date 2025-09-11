import style from "./cart.module.css";
import { UserType } from "@/lib/types";
import { getCurrentUser } from "@/lib/authActions";
import CartList from "./CartList";
import { fetchUserCart } from "@/lib/usersActions";

export default async function Cart() {
  const currentUser: Omit<UserType, "password"> | null =
    (await getCurrentUser()) || null;
  const cart = await fetchUserCart(currentUser?.id || null);

  return (
    <section className={style.cart}>
      <CartList userCart={cart.cart} userId={currentUser?.id} />
    </section>
  );
}
