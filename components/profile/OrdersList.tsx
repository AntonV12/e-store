"use client";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useGetOrdersQuery } from "@/lib/features/orders/ordersApiSlice";
import style from "./profile.module.css";
import React from "react";
import OrderList from "./OrderList";
import { useState } from "react";

export default function OrdersList() {
  const { data: currentUser, isLoading, isSuccess, isError } = useGetCurrentUserQuery();
  const [done, setDone] = useState(false);
  const { data: orders } = useGetOrdersQuery({ userId: currentUser?.id ?? undefined, limit: 10, done });

  if (isError) return <div>Произошла ошибка</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (isSuccess) {
    return currentUser ? (
      <div className={style.profile__orders}>
        <div className={style.profile__orders__header}>
          <h2>{!currentUser.isAdmin ? "Мои " : ""} Заказы</h2>
          <button onClick={() => setDone(!done)}>{done ? "Показать активные" : "Показать завершенные"}</button>
        </div>

        {orders && orders.length > 0 ? (
          <ul>
            {[...orders]
              .sort((a, b) => +(b.id ?? 0) - +(a.id ?? 0))
              .sort((a, b) => +a.isDone - +b.isDone)
              .map((order) => (
                <OrderList key={order.id} order={order} isAdmin={currentUser.isAdmin} />
              ))}
          </ul>
        ) : (
          <div>У вас нет заказов</div>
        )}
      </div>
    ) : (
      <div>Пользователь не найден</div>
    );
  }
}
