import { useEffect, useState } from "react";
import style from "./message.module.css";

export default function Message({ text, onHide }: { text: string; onHide: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!text) return;

    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 2700);

    const removeTimeout = setTimeout(() => {
      onHide();
    }, 3000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(removeTimeout);
    };
  }, [text, onHide]);

  return <p className={`${style.text} ${!visible ? style.disappear : ""}`}>{text}</p>;
}
