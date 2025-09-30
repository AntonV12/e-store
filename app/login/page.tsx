import LoginForm from "@/components/login/LoginForm";
import styles from "@/components/login/login.module.css";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в систему",
  description: "Вход в учетную запись для доступа к системе.",
};

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
