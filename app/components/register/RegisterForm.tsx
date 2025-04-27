"use client";
import styles from "./register.module.css";
import { useSetUserMutation } from "@/lib/features/users/usersApiSlice";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isFetchBaseQueryError, isSerializedError } from "@/lib/middlewares";

export const RegisterForm = () => {
  const [setUser, { isLoading, isError, error }] = useSetUserMutation();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(formData.get("password") as string, salt);

    const user = {
      id: null,
      name: formData.get("name") as string,
      password: hashedPassword,
    };

    try {
      await setUser(user).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
    }
  };

  return (
    <>
      <h2 className={styles.title}>Регистрация</h2>
      <p className={styles.text}>
        Уже есть учетная запись?{" "}
        <Link href="/login" className={styles.link}>
          Войти
        </Link>
      </p>
      <form method="post" className={styles.form} onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Имя" className={styles.input} />
        <input type="password" name="password" placeholder="Пароль" className={styles.input} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Отправка..." : "Зарегистрироваться"}
        </button>
        {isError && (
          <span className={styles.error}>
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
