import Order from "@/components/order/Order";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Страница оформления заказа",
};

export default function OrderPage() {
  return <Order />;
}
