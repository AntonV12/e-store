import OrdersList from "@/components/profile/OrdersList";
import { getCurrentUser } from "@/lib/authActions";
import { cookies } from "next/headers";
import { UserType, OrdersListParamsType } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказы",
  description: "Список Ваших заказов",
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<OrdersListParamsType> }) {
  const params = await searchParams;
  const currentUser: Omit<UserType, "password"> | null = (await getCurrentUser()) || null;
  const tempId: string | null = (await cookies()).get("tempId")?.value || null;

  const user: Omit<UserType, "password"> = currentUser
    ? currentUser
    : {
        id: tempId,
        name: "Гость",
        isAdmin: false,
        avatar: "",
        needRefresh: false,
      };

  return <OrdersList currentUser={user} params={params} />;
}
