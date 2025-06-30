import { LoginForm } from "@/components/login/LoginForm";
import styles from "@/components/login/login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
