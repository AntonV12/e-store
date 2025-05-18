"use client";

import style from "./order.module.css";
import { authApiSlice, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useCreateOrderMutation } from "@/lib/features/orders/ordersApiSlice";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import Input from "./Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setMessage } from "@/lib/features/message/messageSlice";

export default function Order() {
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [createOrder, { isLoading, isSuccess, isError }] = useCreateOrderMutation();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setIsSubmit(true);

    const formData = new FormData(e.currentTarget);
    const city = formData.get("city");
    const street = formData.get("street");
    const house = formData.get("house");
    const apartment = formData.get("apartment");

    const userAddress: string = `г.${city}, ул.${street}, дом ${house}${apartment ? ", " + apartment : ""}`;

    const newOrder = {
      id: null,
      clientId: currentUser?.id,
      phone: Number(formData.get("tel")),
      email: String(formData.get("email")),
      address: userAddress,
      products: currentUser.cart,
      isDone: false,
      date: new Date().toLocaleString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" }),
    };

    if (!newOrder.phone || !newOrder.email || !city || !street || !house || !newOrder.products) return;

    try {
      let result = await createOrder(newOrder).unwrap();
      await updateUser({ ...currentUser, cart: [] });
      dispatch(setMessage(result.message));

      dispatch(
        authApiSlice.util.updateQueryData("getCurrentUser", undefined, (draft) => {
          if (draft) draft.cart = [];
        })
      );

      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (isUserSuccess) {
    return (
      <div className={style.order}>
        <form method="POST" onSubmit={handleSubmit}>
          <h2>Данные покупателя</h2>
          <Input type="tel" name="tel" placeholder="телефон" isSubmit={isSubmit} />
          <Input type="email" name="email" placeholder="email" isSubmit={isSubmit} />
          <div className={style.address}>
            <h2>Адрес доставки</h2>
            <Input type="text" name="city" placeholder="город" isSubmit={isSubmit} />
            <Input type="text" name="street" placeholder="улица" isSubmit={isSubmit} />
            <Input type="text" name="house" placeholder="дом №" isSubmit={isSubmit} />
            <Input type="text" name="apartment" placeholder="квартира" isSubmit={isSubmit} />
          </div>
          <button className={style.button}>Подтвердить</button>
        </form>
      </div>
    );
  }
}
