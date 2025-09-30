"use client";

import { useEffect, useState } from "react";
import { useMessage } from "@/lib/messageContext";
import style from "./message.module.css";

export default function Message() {
  const { message, setMessage } = useMessage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!visible || !message) return null;

  return (
    <div className={`${style.text} ${!visible ? style.disappear : ""}`}>
      {message}
    </div>
  );
}
