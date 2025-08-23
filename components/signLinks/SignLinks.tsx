import Link from "next/link";
import style from "./SignLinks.module.css";
import CartIcon from "@/public/cart2.svg";
import LoginIcon from "@/public/person-circle.svg";
// import { SignLinksSkeleton } from "@/components/skeletons/skeletons";
import { getCurrentUser } from "@/lib/authActions";
import SignLinksClient from "@/components/signLinks/SignLinksClient";
import { UserType } from "@/lib/types";

export default async function SignLinks() {
  const currentUser: Omit<UserType, "password"> | null = await getCurrentUser();
  const cartLength = currentUser?.cart.length;

  return (
    <div className={style.links}>
      <Link className={style.link} href="/cart">
        <CartIcon />
        <p>Корзина</p>
        {cartLength && cartLength > 0 ? <span>{cartLength}</span> : null}
      </Link>
      {currentUser ? (
        <SignLinksClient currentUser={currentUser} />
      ) : (
        <Link className={style.link} href="/login">
          <LoginIcon />
          <p>Вход</p>
        </Link>
      )}
    </div>
  );
}
