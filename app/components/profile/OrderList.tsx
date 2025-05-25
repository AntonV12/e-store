import style from "./order.module.css";
import { OrderType } from "@/lib/types/types";
import CheckIcon from "@/public/check.svg";
import ChevronIcon from "@/public/chevron.svg";
import { useState } from "react";
import OrderListItem from "./OrderListItem";
import { useUpdateOrderMutation } from "@/lib/features/orders/ordersApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import { setMessage } from "@/lib/features/message/messageSlice";

export default function OrderList({ order, isAdmin }: { order: OrderType; isAdmin: boolean }) {
  const [isShow, setIsShow] = useState(isAdmin ? true : false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();
  const dispatch = useAppDispatch();

  const handleShow = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains(style.checkIcon)) return;
    setIsShow(!isShow);
  };

  const handleCheckClick = async () => {
    if (isAdmin) {
      try {
        const updatedOrder = { ...order, isDone: !order.isDone };
        const response = await updateOrder(updatedOrder).unwrap();
        if (response.message) {
          dispatch(setMessage(response.message));
        }
      } catch (error) {
        console.error("Ошибка при обновлении статуса заказа:", error);
      }
    }
  };

  const onMouseEnter = () => {
    if (!isAdmin) return;
    setShowCheckIcon(true);
  };
  const onMouseLeave = () => {
    if (!isAdmin) return;
    setShowCheckIcon(false);
  };

  return (
    <div className={style.orderList}>
      <li key={order.id}>
        <article
          className={`${style.order__item} ${order.isDone ? style.order__done : ""}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className={style.title} onClick={handleShow}>
            {order.isDone || showCheckIcon ? (
              <CheckIcon
                className={style.checkIcon}
                style={{ fill: order.isDone ? "green" : "grey" }}
                onClick={handleCheckClick}
              />
            ) : null}
            <h3>
              Заказ #{order.id} от {order.date}
            </h3>
            <ChevronIcon className={`${style.chevronIcon} ${isShow ? style.rotated : ""}`} />
          </div>
          {isShow && <OrderListItem products={order.products} />}
          {isAdmin ? (
            <div className={style.order__info}>
              <p>
                <span>Клиент id:</span> {order.clientId}
              </p>
              <p>
                <span>Телефон:</span> {order.phone}
              </p>
              <p>
                <span>Email:</span> {order.email}
              </p>
              <p>
                <span>Адрес:</span> {order.address}
              </p>
            </div>
          ) : null}
        </article>
      </li>
    </div>
  );
}
