"use client";

import { CartType, UserType } from "@/lib/types/types";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import { authApiSlice, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import style from "./product.module.css";
import Image from "next/image";
import { RatingArea } from "@/app/components/rating/Rating";
import { useState } from "react";
import { CommentsList } from "@/app/components/comments/CommentsList";
import { AddCommentForm } from "@/app/components/comments/AddCommentForm";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import Amount from "@/app/components/amount/Amount";
import { setMessage } from "@/lib/features/message/messageSlice";
import { useSelector } from "react-redux";
import Message from "@/app/components/message/Message";

export default function Product({ id, isAuth, userId }: { id: number; isAuth: boolean; userId: number }) {
  const dispatch = useAppDispatch();
  const { data: product, isError, isLoading, isSuccess } = useGetProductByIdQuery(id);
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();
  const [amount, setAmount] = useState<number>(1);
  const message = useSelector((state: { message: { text: string } }) => state.message.text);

  const handleAddProductToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUserLoading) return;

    if (isUserSuccess) {
      if (!currentUser || !product) return;

      const formData = new FormData(e.currentTarget);
      if (product?.id && formData.get("amount")) {
        const amount = Number(formData.get("amount") as string);
        if (!amount) return;

        const { cart } = currentUser;
        const existingItem = cart.find((item) => item.id === product.id);

        const updatedCart: CartType[] = existingItem
          ? cart.map((item) => (item.id === product.id ? { ...item, amount: Number(item.amount) + amount } : item))
          : [...cart, { id: product.id, name: product.name, cost: product.cost, imageSrc: product.imageSrc, amount }];
        const updatedUser: UserType = { ...currentUser, cart: updatedCart };

        dispatch(
          authApiSlice.util.updateQueryData("getCurrentUser", undefined, (draft) => {
            if (draft) draft.cart = updatedCart;
          })
        );

        try {
          await updateUser(updatedUser).unwrap();
          dispatch(setMessage("Товар добавлен в корзину"));
        } catch (err) {
          dispatch(
            authApiSlice.util.updateQueryData("getCurrentUser", undefined, (draft) => {
              if (draft) draft.cart = currentUser.cart;
            })
          );
          console.error(err);
        }
      }
    }
  };

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <section className={style.productCard}>
        <div className={style.container}>
          <Image src={product.imageSrc} alt={product.name} width={280} height={280} className={style.img} />
          <div className={style.info}>
            <div className={style.title}>
              <h1>{product.name}</h1>
              <RatingArea product={product} />
              <p className={style.rating}>
                Общий рейтинг:{" "}
                {product?.rating.reduce((acc, rating) => acc + rating.rating, 0) / product?.rating.length || 0}{" "}
                <span className={style.star}>&#9733;</span>
              </p>
            </div>
            <div className={style.price}>
              <form method="post" onSubmit={handleAddProductToCart}>
                <h2>{product.cost.toLocaleString("ru-RU")} ₽</h2>
                <Amount value={amount} setAmount={setAmount} />
                <button type="submit">В корзину</button>
              </form>
            </div>
            <p>{product.description}</p>
          </div>
        </div>

        <CommentsList comments={product.comments} />
        {isAuth ? (
          <AddCommentForm product={product} />
        ) : (
          <p>Чтобы оставить комментарий, войдите в свою учетную запись</p>
        )}

        {message && <Message text={message} onHide={() => dispatch(setMessage(""))} />}
      </section>
    );
  }
}
