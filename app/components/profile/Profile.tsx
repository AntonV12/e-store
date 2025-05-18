"use client";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useGetOrdersQuery } from "@/lib/features/orders/ordersApiSlice";
import style from "./profile.module.css";
import Image from "next/image";
import LoginIcon from "@/public/person-circle.svg";
import CameraIcon from "@/public/photo_camera.svg";
import React from "react";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import OrderList from "./OrderList";

export default function Profile() {
  const { data: currentUser, isLoading, isSuccess, isError, refetch } = useGetCurrentUserQuery();
  const { data: orders } = useGetOrdersQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      if (currentUser) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const updatedUser = { ...currentUser, avatar: base64String };
          await updateUser(updatedUser);
          refetch();
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (isError) return <div>Произошла ошибка</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (isSuccess) {
    return currentUser ? (
      <div className={style.profile}>
        <h2>Мои Данные</h2>
        <div className={style.profile__data}>
          <div className={style.avatar__container}>
            <div className={style.avatar}>
              <input type="file" name="avatar" id="avatar" className={style.avatar__input} onChange={handleAddImage} />
              <label htmlFor="avatar" className={style.avatar__label}></label>
              <CameraIcon className={style.avatar__camera} />
              {currentUser.avatar ? (
                <Image src={currentUser.avatar} alt="avatar" width={72} height={72} className={style.avatar__img} />
              ) : (
                <LoginIcon />
              )}
            </div>
            {currentUser.name}
          </div>
        </div>
        <div className={style.profile__orders}>
          <h2>Мои Заказы</h2>
          {orders && orders.length > 0 ? (
            <ul>
              {[...orders]
                .sort((a, b) => +a.isDone - +b.isDone)
                .sort((a, b) => +(b.id ?? 0) - +(a.id ?? 0))
                .map((order) => (
                  <OrderList key={order.id} order={order} />
                ))}
            </ul>
          ) : (
            <div>У вас нет заказов</div>
          )}
        </div>
      </div>
    ) : (
      <div>Пользователь не найден</div>
    );
  }
}
