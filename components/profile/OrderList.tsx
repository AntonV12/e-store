"use client";

import style from "./order.module.css";
import { OrderType, UserType } from "@/lib/types";
import OrderListItem from "./OrderListItem";
import Chevron from "@/public/chevron.svg";
import Form from "./Form";
import { useState, useEffect } from "react";

export default function OrderList({
  order,
  currentUser,
}: {
  order: OrderType;
  currentUser: Omit<UserType, "password">;
}) {
  const date = new Date(order.date).toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    const savedIsShow = sessionStorage.getItem("show");
    if (savedIsShow) {
      setIsShow(savedIsShow === "true");
    }
  }, []);

  const toggleShow = (e: React.MouseEvent<HTMLDivElement>) => {
    const target: HTMLElement = e.target as HTMLElement;

    if (target.classList.contains(style.checkIcon) || target.closest("svg")) return;

    const newIsShow = !isShow;
    setIsShow(newIsShow);
    sessionStorage.setItem("show", newIsShow.toString());
  };

  return (
    <li key={order.id}>
      <article className={`${style.order__item} ${order.isDone ? style.order__done : ""}`}>
        <div className={style.title} onClick={toggleShow}>
          <Form isDone={order.isDone} id={order.id!} isAdmin={currentUser?.isAdmin || false} />
          <h3>
            Заказ #{order.id} от {date}
          </h3>
          <Chevron className={`${style.chevronIcon} ${isShow ? style.rotated : ""}`} />
        </div>

        <div className={`${style.info} ${isShow ? style.visible : style.hidden}`}>
          <OrderListItem
            products={order.products}
            isDone={order.isDone}
            clientId={order.clientId}
            currentUser={currentUser}
          />
          <p className={style.product__total}>
            Итого:{" "}
            {order.products.reduce((total, product) => total + product.cost * product.amount, 0).toLocaleString()} ₽
          </p>

          {currentUser.isAdmin ? (
            <div className={style.order__info}>
              <p>
                <span>Клиент: {order.username}</span> <span className={style.product__total}>{order.clientId}</span>
              </p>
              <p>
                <span>Телефон:</span> {order.phone}
              </p>
              <p>
                <span>Email:</span> {order.email}
              </p>
              <p>
                <span>Адрес:</span> {order.address}
              </p>
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}
