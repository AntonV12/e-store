"use client";

import Link from "next/link";
import style from "./SignLinks.module.css";
import LoginIcon from "@/public/person-circle.svg";
import { UserType } from "@/lib/types";
import { useEffect } from "react";
import { updateSession } from "@/lib/sessions";

export default function SignLinksClient({ currentUser }: { currentUser: Omit<UserType, "password"> }) {
  useEffect(() => {
    if (currentUser.needRefresh) {
      updateSession();
    }
  }, [currentUser.needRefresh]);

  return (
    <Link className={style.link} href="/profile">
      <LoginIcon />
      <p>{currentUser.name}</p>
    </Link>
  );
}
