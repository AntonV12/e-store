"use client";
import styles from "./login.module.css";
import { useAuthUserMutation } from "@/lib/features/auth/authApiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { UserType } from "@/lib/types/types";

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}
export function isSerializedError(error: unknown): error is { message?: string } {
  return typeof error === "object" && error != null && "message" in error;
}

export const LoginForm = () => {
  const [authUser, { isLoading, isSuccess, isError, error }] = useAuthUserMutation();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user: UserType = {
      id: null,
      name: formData.get("name") as string,
      password: formData.get("password") as string,
      isAdmin: false,
      cart: [],
      avatar: "",
    };

    try {
      await authUser(user).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Ошибка входа:", err);
    }
  };

  return (
    <>
      <h2 className={styles.title}>Вход</h2>
      <p className={styles.text}>
        Нет учетной записи?{" "}
        <Link href="/register" className={styles.link}>
          Зарегистрируйтесь
        </Link>
      </p>
      <form method="post" className={styles.form} onSubmit={handleLogin}>
        <input type="text" name="name" placeholder="Имя" className={`${styles.input} ${isError && styles.error}`} />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          className={`${styles.input} ${isError && styles.error}`}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Отправка..." : "Войти"}
        </button>
        {isError && (
          <span className={styles.errorMessage}>
            {isError &&
              error &&
              (isFetchBaseQueryError(error)
                ? (error.data as { error?: string })?.error || "Ошибка сервера"
                : isSerializedError(error)
                ? error.message || "Неизвестная ошибка"
                : "Ошибка при регистрации")}
          </span>
        )}
      </form>
    </>
  );
};
