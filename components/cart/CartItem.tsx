import { CartType } from "@/lib/types";
import Image from "next/image";
import style from "./cart.module.css";
import CartItemForm from "./CartItemForm";
import DeleteForm from "./DeleteForm";

export default function CartItem({ product, userId }: { product: CartType; userId: number }) {
  return (
    <li key={product.id} className={style.item}>
      <Image
        src={`/api/image?name=${product.imageSrc}`}
        alt={product.name}
        className={style.img}
        width={100}
        height={100}
        priority
      />
      <div className={style.info}>
        <h3>{product.name}</h3>
        <CartItemForm product={product} userId={userId} />
        <h3 className={style.cost}>{(product.cost * product.amount).toLocaleString()} ₽</h3>
        {product.id && <DeleteForm id={product.id} />}
      </div>
    </li>
  );
}
