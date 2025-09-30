import { CartType, UserType } from "@/lib/types";
import RatingArea from "@/components/rating/RatingArea";
import style from "./order.module.css";
import Image from "next/image";

export default function OrderListItem({
  products,
  isDone,
  clientId,
  currentUser,
}: {
  products: CartType[];
  isDone: "0" | "1";
  clientId: string;
  currentUser: Omit<UserType, "password">;
}) {
  return (
    <ul className={style.order__itemList}>
      {products.map((product) => (
        <li key={product.id}>
          <div className={style.product__container}>
            <Image src={`/api/image?name=${product.imageSrc}`} alt={product.name} width={30} height={30} />
            <h3>{product.name}</h3>
            <p className={style.product__total}>
              {product.amount} x {product.cost.toLocaleString()} ₽
            </p>
            <strong>{(product.cost * product.amount).toLocaleString()} ₽</strong>
            {isDone && currentUser?.id === clientId ? (
              <RatingArea id={product.productId} clientId={clientId} rating={product.rating} />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
