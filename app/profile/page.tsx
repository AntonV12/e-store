import Profile from "@/components/profile/Profile";
import { getCurrentUser } from "@/lib/authActions";
import OrdersList from "@/components/profile/OrdersList";
import { OrdersListParamsType } from "@/lib/types";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<ParamsType>;
}) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();

  return (
    <>
      <Profile currentUser={currentUser} />
      <OrdersList currentUser={currentUser} params={params} />
    </>
  );
}
