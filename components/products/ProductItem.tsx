import style from "./products.module.css";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/lib/types/types";

export default function ProductItem({ product }: { product: ProductType }) {
  {
    return (
      <li className={`${style.product}`}>
        <Link href={`/products/${product.id}`}>
          <Image
            src={`/api/image?name=${product.imageSrc[0]}`}
            alt={product.name}
            className={style.img}
            width={230}
            height={180}
            priority
          />
          <h3>{product.name}</h3>
          <p>{product.cost.toLocaleString("ru-RU")} ₽</p>
        </Link>
      </li>
    );
  }
}

/* import style from "./products.module.css";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/lib/types/types";
import { forwardRef, memo } from "react";

const ProductItem = forwardRef<HTMLLIElement, { product: ProductType }>(({ product }, ref) => {
  const handleSaveScrollPosition = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    }
  };

  return (
    <li ref={ref} className={`${style.product}`} onClick={handleSaveScrollPosition}>
      <Link href={`/products/${product.id}`}>
        <Image
          src={`/api/image?name=${product.imageSrc[0]}`}
          alt={product.name}
          className={style.img}
          width={230}
          height={180}
          priority
        />
        <h3>{product.name}</h3>
        <p>{product.cost.toLocaleString("ru-RU")} ₽</p>
      </Link>
    </li>
  );
});

export default memo(ProductItem);
 */
