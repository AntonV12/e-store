import RegisterForm from "@/components/register/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создать учетную запись",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
