import { LoginForm } from "@/app/components/login/LoginForm";
import { RegisterForm } from "@/app/components/login/RegisterForm";
import styles from "@/app/components/login/login.module.css";

export default function UsersPage() {
  return (
    <div className={styles.container}>
      {/* <LoginForm /> */}
      <RegisterForm />
    </div>
  );
}
