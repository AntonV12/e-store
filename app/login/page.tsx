import { LoginForm } from "@/app/components/login/LoginForm";
import styles from "@/app/components/login/login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
