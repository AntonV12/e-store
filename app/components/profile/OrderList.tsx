import style from "./order.module.css";
import { OrderType } from "@/lib/types/types";
import CheckIcon from "@/public/check.svg";
import ChevronIcon from "@/public/chevron.svg";
import { useState } from "react";
import OrderListItem from "./OrderListItem";

export default function OrderList({ order }: { order: OrderType }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className={style.orderList}>
      <li key={order.id}>
        <article
          className={`${style.order__item} ${order.isDone ? style.order__done : ""}`}
          onClick={() => setIsShow(!isShow)}
        >
          <div className={style.title}>
            {order.isDone ? <CheckIcon className={style.checkIcon} /> : null}
            <h3>
              Заказ #{order.id} от {order.date}
            </h3>
            <ChevronIcon className={`${style.chevronIcon} ${isShow ? style.rotated : ""}`} />
          </div>
          {isShow && <OrderListItem products={order.products} />}
        </article>
      </li>
    </div>
  );
}
