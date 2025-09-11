import OrdersList from "@/components/profile/OrdersList";
import { getCurrentUser } from "@/lib/authActions";
import { cookies } from "next/headers";
import { UserType } from "@/lib/types";

export default async function OrdersPage({
	searchParams,
}: {
	searchParams: Promise<ParamsType>;
}) {
	const params = await searchParams;
	const currentUser: UserType | null = (await getCurrentUser()) || null;
	const tempId: string | null = (await cookies()).get("tempId")?.value;
	const user: UserType = currentUser
		? currentUser
		: {
				id: tempId,
				name: "Гость",
				isAdmin: false,
				cart: [],
				avatar: "",
				needRefresh: false,
			};

	return <OrdersList currentUser={user} params={params} />;
}
