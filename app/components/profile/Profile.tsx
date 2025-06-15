"use client";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import style from "./profile.module.css";
import Image from "next/image";
import LoginIcon from "@/public/person-circle.svg";
import CameraIcon from "@/public/photo_camera.svg";
import React from "react";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import OrdersList from "./OrdersList";
import Link from "next/link";
import { useLogoutUserMutation } from "@/lib/features/auth/authApiSlice";
import { ProfileSkeleton } from "@/app/components/skeletons/skeletons";

export default function Profile() {
  const { data: currentUser, isLoading, isSuccess, isError, refetch } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      await refetch();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

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
  if (isLoading) return <ProfileSkeleton />;
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
          {currentUser.isAdmin ? <Link href="/add-product">Добавить новый товар</Link> : null}
          <Link href="/" onClick={handleLogout}>
            Выйти из системы
          </Link>
        </div>
        <OrdersList />
      </div>
    ) : (
      <div>Пользователь не найден</div>
    );
  }
}
