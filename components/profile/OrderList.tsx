"use client";

import style from "./order.module.css";
import { OrderType, UserType } from "@/lib/types";
import OrderListItem from "./OrderListItem";
import Chevron from "@/public/chevron.svg";
import Form from "./Form";
import { useState, useEffect } from "react";

export default function OrderList({ order, currentUser }: { order: OrderType; currentUser: UserType }) {
  const date = new Date(order.date).toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    const savedIsShow = sessionStorage.getItem("show");
    if (savedIsShow) {
      setIsShow(savedIsShow === "true");
    }
  }, []);

  const toggleShow = (e: React.MouseEvent<HTMLDivElement>) => {
    const target: HTMLElement = e.target as HTMLElement;

    if (target.classList.contains(style.checkIcon) || target.closest("svg")) return;
    const newIsShow = !isShow;
    setIsShow(newIsShow);
    sessionStorage.setItem("show", newIsShow.toString());
  };

  return (
    <li key={order.id}>
      <article className={`${style.order__item} ${order.isDone ? style.order__done : ""}`}>
        <div className={style.title} onClick={toggleShow}>
          <Form isDone={order.isDone} id={order.id!} />
          <h3>
            Заказ #{order.id} от {date}
          </h3>
          <Chevron className={`${style.chevronIcon} ${isShow ? style.rotated : ""}`} />
        </div>

        <div className={`${style.info} ${isShow ? style.visible : style.hidden}`}>
          <OrderListItem
            products={order.products}
            isDone={order.isDone}
            clientId={order.clientId}
            currentUser={currentUser}
          />
          <p className={style.product__total}>
            Итого:{" "}
            {order.products.reduce((total, product) => total + product.cost * product.amount, 0).toLocaleString()} ₽
          </p>

          {currentUser.isAdmin ? (
            <div className={style.order__info}>
              <p>
                <span>Клиент id:</span> {order.clientId ? order.clientId : "незарегистрированный пользователь"}
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
        </div>
      </article>
    </li>
  );
}

// import style from "./order.module.css";
// import { OrderType } from "@/lib/types";
// import CheckIcon from "@/public/check.svg";
// import ChevronIcon from "@/public/chevron.svg";
// import { useState } from "react";
// import OrderListItem from "./OrderListItem";
// import { useUpdateOrderMutation } from "@/lib/features/orders/ordersApiSlice";
// import { useAppDispatch } from "@/lib/hooks";
// import { setMessage } from "@/lib/features/message/messageSlice";

// export default function OrderList({ order, isAdmin }: { order: OrderType; isAdmin: boolean }) {
//   const [isShow, setIsShow] = useState(isAdmin ? true : false);
//   const [showCheckIcon, setShowCheckIcon] = useState(false);
//   const [updateOrder] = useUpdateOrderMutation();
//   const dispatch = useAppDispatch();

//   const handleShow = (e: React.MouseEvent<HTMLDivElement>) => {
//     if ((e.target as HTMLElement).classList.contains(style.checkIcon)) return;
//     setIsShow(!isShow);
//   };

//   const handleCheckClick = async () => {
//     if (isAdmin) {
//       try {
//         if (order.id) {
//           const response = await updateOrder({ id: order.id, param: "isDone", value: !order.isDone }).unwrap();

//           if (response.message) {
//             dispatch(setMessage(response.message));
//           }
//         }
//       } catch (error) {
//         console.error("Ошибка при обновлении статуса заказа:", error);
//       }
//     }
//   };

//   const onMouseEnter = () => {
//     if (!isAdmin) return;
//     setShowCheckIcon(true);
//   };
//   const onMouseLeave = () => {
//     if (!isAdmin) return;
//     setShowCheckIcon(false);
//   };

//   return (
//     <div className={style.orderList}>
//       <li key={order.id}>
//         <article
//           className={`${style.order__item} ${order.isDone ? style.order__done : ""}`}
//           onMouseEnter={onMouseEnter}
//           onMouseLeave={onMouseLeave}
//         >
//           <div className={style.title} onClick={handleShow}>
//             {order.isDone || showCheckIcon ? (
//               <CheckIcon
//                 className={style.checkIcon}
//                 style={{ fill: order.isDone ? "green" : "grey" }}
//                 onClick={handleCheckClick}
//               />
//             ) : null}
//             <h3>
//               Заказ #{order.id} от {order.date}
//             </h3>
//             <ChevronIcon className={`${style.chevronIcon} ${isShow ? style.rotated : ""}`} />
//           </div>
//           {isShow && (
//             <>
//               <OrderListItem products={order.products} isDone={order.isDone} clientId={order.clientId} />
//               <p className={style.product__total}>
//                 Итого:{" "}
//                 {order.products.reduce((total, product) => total + product.cost * product.amount, 0).toLocaleString()} ₽
//               </p>
//             </>
//           )}

//           {isAdmin ? (
//             <div className={style.order__info}>
//               <p>
//                 <span>Клиент id:</span> {order.clientId}
//               </p>
//               <p>
//                 <span>Телефон:</span> {order.phone}
//               </p>
//               <p>
//                 <span>Email:</span> {order.email}
//               </p>
//               <p>
//                 <span>Адрес:</span> {order.address}
//               </p>
//             </div>
//           ) : null}
//         </article>
//       </li>
//     </div>
//   );
// }
