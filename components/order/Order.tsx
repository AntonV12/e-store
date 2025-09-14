import { getCurrentUser } from "@/lib/authActions";
import OrderForm from "./OrderForm";
import { cookies } from "next/headers";
import { fetchUserCart } from "@/lib/usersActions";

export default async function Order() {
  const currentUser = await getCurrentUser();
  const tempId: string | null = (await cookies()).get("tempId")?.value || null;
  const cart = await fetchUserCart(currentUser?.id || null);

  return <OrderForm currentUser={currentUser!} tempId={tempId} cart={cart.cart} />;
}
