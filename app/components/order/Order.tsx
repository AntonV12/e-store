"use client";

import { OrderType } from "@/lib/types/types";
import style from "./order.module.css";
import { authApiSlice, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useCreateOrderMutation } from "@/lib/features/orders/ordersApiSlice";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/hooks";

export default function Order() {
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [createOrder, { isLoading, isSuccess, isError }] = useCreateOrderMutation();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser?.id) return;

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
      products: JSON.stringify(currentUser.cart),
    };

    dispatch(
      authApiSlice.util.updateQueryData("getCurrentUser", undefined, (draft) => {
        if (draft) draft.cart = [];
      })
    );

    try {
      await createOrder(newOrder).unwrap();
      await updateUser({ ...currentUser, cart: [] });
      alert(newOrder.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (isUserSuccess) {
    return (
      <div className={style.order}>
        <form method="POST" onSubmit={handleSubmit}>
          <h2>Данные покупателя</h2>
          <input type="tel" name="tel" placeholder="телефон" />
          <input type="email" name="email" placeholder="email" />
          <div className={style.address}>
            <h2>Адрес доставки</h2>
            <input type="text" name="city" placeholder="город" />
            <input type="text" name="street" placeholder="улица" />
            <input type="text" name="house" placeholder="дом №" />
            <input type="text" name="apartment" placeholder="квартира" />
          </div>
          <button className={style.button}>Подтвердить</button>
        </form>
      </div>
    );
  }
}
