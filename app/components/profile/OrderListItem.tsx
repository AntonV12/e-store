import { CartType } from "@/lib/types/types";
import style from "./order.module.css";
import Image from "next/image";

export default function OrderListItem({ products }: { products: CartType[] }) {
  return (
    <ul className={style.order__itemList}>
      {products.map((product) => (
        <li key={product.id}>
          <Image src={product.imageSrc} alt={product.name} width={30} height={30} />
          <h3>{product.name}</h3>
          <p className={style.product__total}>
            {product.amount} x {product.cost.toLocaleString()} ₽
          </p>
          <strong>{(product.cost * product.amount).toLocaleString()} ₽</strong>
        </li>
      ))}
    </ul>
  );
}
