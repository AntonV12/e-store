"use client";

import style from "./profile.module.css";
import { useActionState, useRef } from "react";
import { UpdateUserState, UserType } from "@/lib/types";
import { updateUser } from "@/lib/usersActions";

export default function AvatarForm({ currentUser }: { currentUser: Omit<UserType, "password"> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: UpdateUserState = {
    id: currentUser.id,
    error: null,
    message: "",
    formData: {
      avatar: currentUser.avatar,
    },
  };

  const [state, formAction] = useActionState<UpdateUserState, FormData>(updateUser, initialState);

  const handleChange = () => {
    if (!formRef.current) return;
    formRef.current.requestSubmit();
  };

  return (
    <form action={formAction} ref={formRef} className={style.avatar__form}>
      <input
        type="file"
        name="avatar"
        id="avatar"
        className={style.avatar__input}
        accept="image/*"
        onChange={handleChange}
      />
      <label htmlFor="avatar" className={style.avatar__label}></label>
    </form>
  );
}
