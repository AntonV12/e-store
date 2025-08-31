import style from "./cart.module.css";
import { UserType } from "@/lib/types";
import { getCurrentUser } from "@/lib/authActions";
import CartList from "./CartList";

export default async function Cart() {
  const currentUser: Omit<UserType, "password"> | null = await getCurrentUser();

  return (
    <section className={style.cart}>
      <CartList userCart={currentUser?.cart || []} userId={currentUser?.id || 0} />
    </section>
  );
}
