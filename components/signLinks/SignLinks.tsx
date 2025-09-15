import { getCurrentUser } from "@/lib/authActions";
import SignLinksClient from "@/components/signLinks/SignLinksClient";
import { UserType } from "@/lib/types";
import { fetchUserCart } from "@/lib/usersActions";
import { getOrdersLength } from "@/lib/ordersActions";

export default async function SignLinks() {
  const currentUser: Omit<UserType, "password"> | null = await getCurrentUser();
  const cart = await fetchUserCart(currentUser?.id || null);
  const ordersLength = await getOrdersLength(currentUser?.id || null);

  return <SignLinksClient currentUser={currentUser!} cart={cart.cart} ordersLength={ordersLength} />;
}
