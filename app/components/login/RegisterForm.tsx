"use client";
import styles from "./login.module.css";
import { useSetUserMutation } from "@/lib/features/users/usersApiSlice";
import { useState } from "react";

export const RegisterForm = () => {
  const [setUser, { isLoading, isSuccess, isError }] = useSetUserMutation();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = {
      id: null,
      name: formData.get("name") as string,
      password: formData.get("password") as string,
    };

    await setUser(user);
  };

  console.log(isSuccess);

  return (
    <>
      <h2 className={styles.title}>Регистрация</h2>
      <form method="post" className={styles.form} onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Имя" className={styles.input} />
        <input type="password" name="password" placeholder="Пароль" className={styles.input} />
        <button type="submit" disabled={isLoading}>
          Зарегистрироваться
        </button>
      </form>
    </>
  );
};
