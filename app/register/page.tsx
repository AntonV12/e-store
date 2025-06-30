import { RegisterForm } from "@/components/register/RegisterForm";
import styles from "@/components/login/login.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
}
