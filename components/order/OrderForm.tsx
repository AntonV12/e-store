"use client";

import style from "./order.module.css";
import Input from "./Input";
import { useActionState, useState, useEffect } from "react";
import { UserType, OrderType, CreateOrderState } from "@/lib/types";
import { createOrder } from "@/lib/ordersActions";
import { useMessage } from "@/lib/messageContext";
import { useRouter } from "next/navigation";

export default function OrderForm({ currentUser }: { currentUser: Omit<UserType, "password"> }) {
  const { setMessage } = useMessage();
  const router = useRouter();
  const initialState: CreateOrderState = {
    error: null,
    message: "",
    formData: {
      id: null,
      clientId: currentUser.id!,
      phone: "",
      email: "",
      city: "",
      street: "",
      house: "",
      apartment: "",
      products: currentUser.cart,
      isDone: "0",
      date: new Date().toISOString(),
    },
  };
  const [state, formAction, isPending] = useActionState<CreateOrderState, FormData>(createOrder, initialState);

  useEffect(() => {
    if (state.message) {
      setMessage(state.message);
      router.push("/");
    }
  }, [state.message, setMessage]);

  return (
    <div className={style.order}>
      <form action={formAction}>
        <h2>Данные покупателя</h2>
        <Input type="tel" name="phone" placeholder="телефон" isError={!!state.error} />
        <Input type="email" name="email" placeholder="email" isError={!!state.error} />
        <div className={style.address}>
          <h2>Адрес доставки</h2>
          <Input type="text" name="city" placeholder="город" isError={!!state.error} />
          <Input type="text" name="street" placeholder="улица" isError={!!state.error} />
          <Input type="text" name="house" placeholder="дом №" isError={!!state.error} />
          <Input type="text" name="apartment" placeholder="квартира" isError={!!state.error} />
        </div>
        <button type="submit" className={style.button} disabled={isPending}>
          Подтвердить
        </button>
      </form>
    </div>
  );
}
