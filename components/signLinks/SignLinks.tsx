import Link from "next/link";
import style from "./SignLinks.module.css";
import { CartIcon, LoginIcon } from "@/app/Icons";
// import CartIcon from "@/public/cart2.svg";
// import LoginIcon from "@/public/person-circle.svg";
// import { SignLinksSkeleton } from "@/components/skeletons/skeletons";
import { getCurrentUser } from "@/lib/authActions";

export default async function SignLinks() {
  const currentUser = await getCurrentUser();

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
