"use client";

import style from "./order.module.css";
import Input from "./Input";
import { useActionState, useEffect } from "react";
import { UserType, CreateOrderState, CartType } from "@/lib/types";
import { createOrder } from "@/lib/ordersActions";
import { useMessage } from "@/lib/messageContext";
import { useRouter } from "next/navigation";

export default function OrderForm({
  currentUser,
  tempId,
  cart,
}: {
  currentUser: Omit<UserType, "password"> | null;
  tempId: string | null;
  cart: CartType[];
}) {
  const { setMessage } = useMessage();
  const router = useRouter();
  const initialState: CreateOrderState = {
    error: null,
    message: "",
    formData: {
      id: null,
      clientId: currentUser?.id || tempId || "",
      username: currentUser?.name || "",
      phone: "",
      email: "",
      city: "",
      street: "",
      house: "",
      apartment: "",
      products: cart,
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

    if (state.error) {
      setMessage(state.error);
    }
  }, [state.message, state.error, setMessage, router]);

  return (
    <div className={style.order}>
      <form action={formAction}>
        <h2>Данные покупателя</h2>
        <Input
          type="text"
          name="username"
          placeholder="имя"
          isError={!!state.error}
          defaultValue={currentUser?.name || ""}
        />
        <Input type="tel" name="phone" placeholder="телефон" isError={!!state.error} defaultValue={null} />
        <Input type="email" name="email" placeholder="email" isError={!!state.error} defaultValue={null} />
        <div className={style.address}>
          <h2>Адрес доставки</h2>
          <Input type="text" name="city" placeholder="город" isError={!!state.error} defaultValue={null} />
          <Input type="text" name="street" placeholder="улица" isError={!!state.error} defaultValue={null} />
          <Input type="text" name="house" placeholder="дом №" isError={!!state.error} defaultValue={null} />
          <Input type="text" name="apartment" placeholder="квартира" isError={!!state.error} defaultValue={null} />
        </div>
        <button type="submit" className={style.button} disabled={isPending}>
          Подтвердить
        </button>
      </form>
    </div>
  );
}
