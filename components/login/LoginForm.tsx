"use client";

import { useActionState } from "react";
import styles from "./login.module.css";
import { loginUser } from "@/lib/authActions";
import Link from "next/link";
import { LoginState } from "@/lib/types";

export default function LoginForm() {
  const initialState: LoginState = {
    error: "",
    message: "",
    formData: {
      name: "",
      password: "",
    },
  };
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginUser, initialState);

  return (
    <>
      <h2 className={styles.title}>Вход</h2>
      <p className={styles.text}>
        Нет учетной записи?{" "}
        <Link href="/register" className={styles.link}>
          Зарегистрируйтесь
        </Link>
      </p>

      <form action={formAction} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          className={`${styles.input}`}
          defaultValue={state.formData?.name}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          className={`${styles.input}`}
          defaultValue={state.formData?.password}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Отправка..." : "Войти"}
        </button>
        {state.error && <span className={styles.errorMessage}>{state.error}</span>}
      </form>
    </>
  );
}
