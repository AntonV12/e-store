"use client";

import { CartType, UserType } from "@/lib/types/types";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import { authApiSlice, useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
import style from "./product.module.css";
import { useState, useEffect, useRef } from "react";
import { CommentsList } from "@/components/comments/CommentsList";
import { AddCommentForm } from "@/components/comments/AddCommentForm";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import Amount from "@/components/amount/Amount";
import { setMessage } from "@/lib/features/message/messageSlice";
import { useSelector } from "react-redux";
import Message from "@/components/message/Message";
import CameraIcon from "@/public/photo_camera.svg";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateViewedMutation,
} from "@/lib/features/products/productsApiSlice";
import { useRouter } from "next/navigation";
import { ProductSkeleton } from "@/components/skeletons/skeletons";
import TextEditor from "@/components/editor/TextEditor";
import Slider from "@/components/slider/Slider";

export default function Product({ id, isAuth }: { id: number; isAuth: boolean }) {
  const dispatch = useAppDispatch();
  const { data: product, isError, isLoading, isSuccess } = useGetProductByIdQuery(id);
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdateUserLoading }] = useUpdateUserMutation();
  const [images, setImages] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const message = useSelector((state: { message: { text: string } }) => state.message.text);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateProduct, { isLoading: isUpdateProductLoading }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleteProductLoading }] = useDeleteProductMutation();
  const router = useRouter();
  const [updateViewed] = useUpdateViewedMutation();
  let updateProductViewedTimeoutId: NodeJS.Timeout | null = null;
  const editorRef = useRef<any>(null);
  const [isImagesChanged, setIsImagesChanged] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess && product) {
      setImages(product.imageSrc);
    }
  }, [isSuccess, product]);

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

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isImagesChanged) {
      const files = Array.from(e.target.files);
      const newImages: string[] = files.map((file) => {
        return URL.createObjectURL(file);
      });
      setImages(newImages);
      setIsImagesChanged(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (isEdit && product) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const description = editorRef.current.getContent() || "";
        formData.append("description", description);
        if (product.id) {
          formData.append("id", product.id.toString());
        }

        const responce = await updateProduct(formData);

        if ("error" in responce) {
          throw new Error("Ошибка записи");
        }

        setIsImagesChanged(false);
        setIsEdit(false);
        setImages(product.imageSrc);
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
      if (!currentUser) {
        dispatch(setMessage("Пожалуйста, авторизуйтесь"));
        return;
      }
      if (!product) return;

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
            <form method="POST" onSubmit={handleEditSubmit} className={style.editForm} encType="multipart/form-data">
              <div className={style.container}>
                <div className={style.imageForm}>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    className={style.fileInput}
                    accept="image/*"
                    onChange={handleEditImage}
                    multiple
                  />
                  <label htmlFor="images" className={style.fileLabel}></label>
                  <CameraIcon className={style.cameraIcon} />
                  <div className={style.imgContainer} style={{ width: "100%" }}>
                    <Slider images={images} isImagesChanged={isImagesChanged} />
                  </div>
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
              <div className={style.imgContainer}>
                <Slider images={images} isImagesChanged={isImagesChanged} />
              </div>
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
                    <button type="submit" disabled={isUpdateUserLoading}>
                      В корзину
                    </button>
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
