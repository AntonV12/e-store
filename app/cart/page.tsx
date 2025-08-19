import Cart from "@/components/cart/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Просмотр и управление товарами в корзине",
};

export default function RegisterPage() {
  return <Cart />;
}
