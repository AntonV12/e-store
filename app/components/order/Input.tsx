import { useState } from "react";
import style from "./order.module.css";

export default function Input({
  type,
  name,
  placeholder,
  isSubmit,
}: {
  type: string;
  name: string;
  placeholder: string;
  isSubmit: boolean;
}) {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (type) {
      case "tel":
        setValue(value.replace(/[^0-9]/g, ""));
        break;
      case "email":
        setValue(value.replace(/[^a-zA-Z0-9@.]/g, ""));
        break;
      default:
        setValue(value);
        break;
    }
  };

  const validation = () => {
    switch (type) {
      case "tel":
        return /\d+/.test(value);

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      default:
        return value.length > 0;
    }
  };

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={`${isSubmit && !validation() ? style.error : isSubmit && style.success}`}
    />
  );
}
