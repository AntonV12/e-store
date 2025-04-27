import { RegisterForm } from "@/app/components/register/RegisterForm";
import styles from "@/app/components/login/login.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
}
