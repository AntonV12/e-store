import style from "./profile.module.css";
import { UserType } from "@/lib/types";
import { fetchOrders } from "@/lib/ordersActions";
import OrderList from "./OrderList";
import { OrdersListParamsType } from "@/lib/types";
import ToggleButton from "./ToggleButton";

export default async function OrdersList({
  currentUser,
  params,
}: {
  currentUser: Omit<UserType, "password">;
  params: OrdersListParamsType;
}) {
  const { limit, done } = params;
  const orders = await fetchOrders(currentUser?.id, limit, done === "true", currentUser?.isAdmin);

  return (
    <div className={style.profile__orders}>
      <div className={style.profile__orders__header}>
        <h2>{!currentUser?.isAdmin ? "Мои " : ""} Заказы</h2>
        <ToggleButton />
      </div>

      {orders && orders.length > 0 ? (
        <ul>
          {[...orders]
            .sort((a, b) => +(b.id ?? 0) - +(a.id ?? 0))
            .sort((a, b) => +a.isDone - +b.isDone)
            .map((order) => (
              <OrderList key={order.id} order={order} currentUser={currentUser} />
            ))}
        </ul>
      ) : (
        <div>нет заказов</div>
      )}
    </div>
  );
}
