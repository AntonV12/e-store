import style from "./products.module.css";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/lib/types";
import { forwardRef, memo } from "react";

const ProductItem = forwardRef<HTMLLIElement, { product: ProductType; isPriority?: boolean }>(
  ({ product, isPriority = false }, ref) => {
    return (
      <li className={`${style.product}`} ref={ref}>
        <Link href={`/products/${product.id}`} target="_blank" rel="noopener noreferer" prefetch={false}>
          <Image
            src={`/api/image?name=${product.imageSrc[0]}`}
            alt={product.name}
            className={style.img}
            width={230}
            height={180}
            priority={isPriority}
          />
          <h3>{product.name}</h3>
          <p>{product.cost.toLocaleString("ru-RU")} ₽</p>
        </Link>
      </li>
    );
  },
);

ProductItem.displayName = "ProductItem";

export default memo(ProductItem);
