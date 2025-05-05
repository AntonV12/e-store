import { UserType, CartType } from "@/lib/types/types";
import { useState, useRef } from "react";
import { useUpdateUserMutation } from "@/lib/features/users/usersApiSlice";
import { authApiSlice } from "@/lib/features/auth/authApiSlice";
import { debounce } from "@/lib/functions/functions";
import Image from "next/image";
import style from "./cart.module.css";
import { useAppDispatch } from "@/lib/hooks";

export default function CartItem({
  product,
  currentUser,
  setTotal,
}: {
  product: CartType;
  currentUser: UserType;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [amount, setAmount] = useState<number>(product.amount);
  const [updateUser, { isLoading: isUpdateUserLoading, isError: isUpdateUserError, isSuccess: isUpdateUserSuccess }] =
    useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const debouncedUpdateUserRef = useRef(
    debounce(async (userData: UserType) => {
      try {
        await updateUser(userData);
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    }, 500)
  );

  const updateCart = (newAmount: number) => {
    setAmount(newAmount);

    const updatedCart = currentUser.cart.map((item) =>
      item.id === product.id ? { ...product, amount: newAmount } : item
    );
    const updatedUser = { ...currentUser, cart: updatedCart };
    setTotal(updatedUser.cart.reduce((acc, item) => acc + item.cost * item.amount, 0));
    debouncedUpdateUserRef.current(updatedUser);
  };

  const handleAmountDecrease = async () => updateCart(amount > 1 ? amount - 1 : amount);
  const handleAmountIncrease = async () => updateCart(amount + 1);
  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 1) return;
    updateCart(+e.target.value);
  };

  const handleDelete = async () => {
    const updatedCart = currentUser.cart.filter((item) => item.id !== product.id);
    const updatedUser = { ...currentUser, cart: updatedCart };

    dispatch(
      authApiSlice.util.updateQueryData("getCurrentUser", undefined, (draft) => {
        if (draft) draft.cart = updatedCart;
      })
    );

    try {
      await updateUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li key={product.id} className={style.item}>
      <Image src={product.imageSrc} alt={product.name} className={style.img} width={100} height={100} priority={true} />
      <div className={style.info}>
        <h3>{product.name}</h3>
        <div className={style.amount}>
          <button type="button" onClick={handleAmountDecrease}>
            -
          </button>
          <input type="text" name="amount" value={amount} onChange={handleAmountChange} />
          <button type="button" onClick={handleAmountIncrease}>
            +
          </button>
        </div>
        <h3 className={style.cost}>{(product.cost * amount).toLocaleString()} ₽</h3>
        <button className={style.deleteBtn} onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </li>
  );
}
