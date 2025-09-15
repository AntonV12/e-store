"use client";

import { CartType } from "@/lib/types";
import Image from "next/image";
import style from "./cart.module.css";
import CartItemForm from "./CartItemForm";
import DeleteForm from "./DeleteForm";
import { useState, useEffect } from "react";

export default function CartItem({ product, userId }: { product: CartType; userId: string | null }) {
  const [amount, setAmount] = useState<number>(product.amount);
  const [cost, setCost] = useState<number>(product.cost * product.amount);

  useEffect(() => {
    setCost(product.cost * amount);
  }, [amount, product.cost]);

  return (
    <li key={product.productId} className={style.item}>
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
        <CartItemForm product={product} userId={userId} amount={amount} setAmount={setAmount} />

        <h3 className={style.cost}>{cost.toLocaleString()} ₽</h3>
        <DeleteForm id={product.id!} productId={product.productId} />
      </div>
    </li>
  );
}
