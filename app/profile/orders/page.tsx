import { fetchOrders } from "@/lib/ordersActions";

export default async function OrdersPage({
	params,
}: {
	params: Promise<{ limit: number; done: boolean; isAdmin: boolean }>;
}) {
	const { limit, done, isAdmin } = await params;
	console.log(limit, done, isAdmin);
	const orders = await fetchOrders(10, false, currentUser.isAdmin);

	return (
		<ul>
			{orders.map((order) => (
				<li key={order.id}>{order.name}</li>
			))}
		</ul>
	);
}
