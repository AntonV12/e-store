"use client";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import { useGetOrdersQuery } from "@/lib/features/orders/ordersApiSlice";

export default function Profile() {
  const { data: currentUser, isLoading, isSuccess, isError } = useGetCurrentUserQuery();
  const { data: orders } = useGetOrdersQuery();

  if (isError) return <div>Произошла ошибка</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (isSuccess) {
    return currentUser ? (
      <div>
        <p>Имя: {currentUser.name}</p>
        <p>Ваши заказы:</p>
        {orders?.map((order) => (
          <div key={order.id}>
            <p>Номер заказа: {order.id}</p>
            {order.products.map((product) => (
              <div key={product.id}>
                <p>Название: {product.name}</p>
                <p>Цена: {product.cost}</p>
                <p>Количество: {product.amount}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    ) : (
      <div>Пользователь не найден</div>
    );
  }
}
