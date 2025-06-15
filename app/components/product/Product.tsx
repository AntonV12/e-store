"use client";

import { CartType, UserType } from "@/lib/types/types";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import { authApiSlice, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import style from "./product.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CommentsList } from "@/app/components/comments/CommentsList";
import { AddCommentForm } from "@/app/components/comments/AddCommentForm";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import Amount from "@/app/components/amount/Amount";
import { setMessage } from "@/lib/features/message/messageSlice";
import { useSelector } from "react-redux";
import Message from "@/app/components/message/Message";
import CameraIcon from "@/public/photo_camera.svg";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateViewedMutation,
} from "@/lib/features/products/productsApiSlice";
import { useRouter } from "next/navigation";
import { ProductSkeleton } from "@/app/components/skeletons/skeletons";
import TextEditor from "@/app/components/editor/TextEditor";

export default function Product({ id, isAuth, userId }: { id: number; isAuth: boolean; userId: number }) {
  const dispatch = useAppDispatch();
  const { data: product, isError, isLoading, isSuccess } = useGetProductByIdQuery(id);
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();
  const [amount, setAmount] = useState<number>(1);
  const message = useSelector((state: { message: { text: string } }) => state.message.text);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateProduct, { isLoading: isUpdateProductLoading, isError: isUpdateProductError }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleteProductLoading, isError: isDeleteProductError }] =
    useDeleteProductMutation();
  const router = useRouter();
  const [updateViewed, { isLoading: isUpdateViewedLoading, isError: isUpdateViewedError }] = useUpdateViewedMutation();
  let updateProductViewedTimeoutId: NodeJS.Timeout | null = null;
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (isSuccess) {
      if (updateProductViewedTimeoutId) {
        clearTimeout(updateProductViewedTimeoutId);
      }

      updateProductViewedTimeoutId = setTimeout(async () => {
        if (product.id) {
          await updateViewed({ id: product.id, params: { viewed: product.viewed + 1 } }).unwrap();
        }
      }, 3000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess && !product) {
      router.push("/");
    }
  }, [isSuccess, product, router]);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (isEdit && product) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const cost = formData.get("cost") as string;
        const imageFile = formData.get("image") as File;
        const description = editorRef.current.getContent() || "";

        let imageSrc: string = product.imageSrc;
        if (imageFile && imageFile.size > 0) {
          imageSrc = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });
        }

        const updatedProduct = {
          ...product,
          name,
          category,
          cost: Number(cost),
          imageSrc,
          description,
        };

        await updateProduct(updatedProduct).unwrap();
        setIsEdit(false);
        dispatch(setMessage("Товар успешно обновлен"));
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

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

  const handleDeleteProduct = async () => {
    if (isUserLoading || isUpdateProductLoading || isDeleteProductLoading) return;

    try {
      const confirm = window.confirm("Вы уверены, что хотите удалить этот товар?");
      if (!confirm) return;
      await deleteProduct(id).unwrap();
      dispatch(setMessage("Товар успешно удален"));
    } catch (err) {
      console.error("Error deleting product:", err);
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
    return <ProductSkeleton />;
  }

  if (isSuccess && !product) {
    return null;
  }

  if (isSuccess) {
    return (
      <section className={style.productCard}>
        <div className={style.container}>
          {isEdit ? (
            <form method="post" onSubmit={handleEditSubmit}>
              <div className={style.container}>
                <div className={style.imageForm}>
                  <input type="file" name="image" id="image" className={style.fileInput} />
                  <label htmlFor="image" className={style.fileLabel}></label>
                  <CameraIcon className={style.cameraIcon} />
                  <Image src={product.imageSrc} alt={product.name} width={280} height={280} className={style.img} />
                </div>
                <div className={style.info}>
                  <div className={style.title}>
                    <input
                      type="text"
                      name="name"
                      defaultValue={product.name}
                      className={style.productName}
                      placeholder="Название товара"
                    />
                  </div>
                  <div className={style.category}>
                    <input
                      type="text"
                      name="category"
                      defaultValue={product.category}
                      className={style.categoryInput}
                      placeholder="Категория"
                    />
                  </div>
                  <div className={style.price}>
                    <input
                      type="text"
                      name="cost"
                      defaultValue={product.cost}
                      className={style.priceInput}
                      placeholder="Цена"
                    />
                  </div>
                  <TextEditor ref={editorRef} initialContent={product.description} />
                </div>
              </div>

              <button type="submit" className={style.editButton}>
                Сохранить
              </button>
            </form>
          ) : (
            <>
              <Image src={product.imageSrc} alt={product.name} width={280} height={280} className={style.img} />
              <div className={style.info}>
                <div className={style.title}>
                  <h1 className={style.productName}>{product.name}</h1>
                  <p className={style.rating}>
                    Общий рейтинг:{" "}
                    {product?.rating.reduce((acc, rating) => acc + rating.rating, 0) / product?.rating.length || 0}{" "}
                    <span className={style.star}>&#9733;</span>
                  </p>
                </div>
                <div className={style.price}>
                  <form method="post" onSubmit={handleAddProductToCart}>
                    <h2 className={style.priceInput}>{product.cost.toLocaleString("ru-RU")} ₽</h2>
                    <Amount value={amount} setAmount={setAmount} />
                    <button type="submit">В корзину</button>
                  </form>
                </div>
                <div dangerouslySetInnerHTML={{ __html: product.description }} className={style.description}></div>
              </div>
            </>
          )}
        </div>

        {!isEdit && currentUser?.isAdmin ? (
          <div className={style.editButtons}>
            <button onClick={toggleEdit}>Изменить</button>
            <button onClick={handleDeleteProduct}>Удалить</button>
          </div>
        ) : null}

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
