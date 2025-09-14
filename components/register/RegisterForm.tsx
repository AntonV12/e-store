"use client";

import styles from "./register.module.css";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { LoginState } from "@/lib/types";
import { createUser } from "@/lib/usersActions";
import { useMessage } from "@/lib/messageContext";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const initialState: LoginState = {
    error: "",
    message: "",
    formData: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  };
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(createUser, initialState);
  const { setMessage } = useMessage();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      setMessage(state.message);
      router.push("/");
    }
  }, [state.message, setMessage, router]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Регистрация</h2>
      <p className={styles.text}>
        Уже есть учетная запись?{" "}
        <Link href="/login" className={styles.link}>
          Войти
        </Link>
      </p>
      <form action={formAction} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          className={`${styles.input} ${state.error ? styles.errorInput : ""}`}
          defaultValue={state.formData?.name}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          className={`${styles.input} ${state.error ? styles.errorInput : ""}`}
          defaultValue={state.formData?.password}
          autoComplete="off"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          className={`${styles.input} ${state.error ? styles.errorInput : ""}`}
          defaultValue={state.formData?.confirmPassword}
          autoComplete="off"
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Отправка..." : "Зарегистрироваться"}
        </button>
        {state.error && <span className={styles.error}>{state.error}</span>}
      </form>
    </div>
  );
}
