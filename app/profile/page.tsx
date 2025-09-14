import Profile from "@/components/profile/Profile";
import { getCurrentUser } from "@/lib/authActions";
import OrdersList from "@/components/profile/OrdersList";
import { OrdersListParamsType, UserType } from "@/lib/types";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<OrdersListParamsType> }) {
  const params = await searchParams;
  const currentUser: Omit<UserType, "password"> | null = (await getCurrentUser()) || null;

  return (
    <>
      <Profile currentUser={currentUser} />
      <OrdersList currentUser={currentUser!} params={params} />
    </>
  );
}
