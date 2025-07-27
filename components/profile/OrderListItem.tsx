import { CartType } from "@/lib/types/types";
import style from "./order.module.css";
import Image from "next/image";
import { RatingArea } from "@/components/rating/Rating";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";

export default function OrderListItem({
  products,
  isDone,
  clientId,
}: {
  products: CartType[];
  isDone: boolean;
  clientId: number;
}) {
  const { data: currentUser } = useGetCurrentUserQuery();

  return (
    <ul className={style.order__itemList}>
      {products.map((product) => (
        <li key={product.id}>
          <div className={style.product__container}>
            <Image src={`/api/image?name=${product.imageSrc[0]}`} alt={product.name} width={30} height={30} />
            <h3>{product.name}</h3>
            <p className={style.product__total}>
              {product.amount} x {product.cost.toLocaleString()} ₽
            </p>
            <strong>{(product.cost * product.amount).toLocaleString()} ₽</strong>
            {isDone && currentUser?.id === clientId ? <RatingArea product={product} /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
