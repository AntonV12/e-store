import { useState } from "react";
import style from "./order.module.css";

export default function Input({
  type,
  name,
  placeholder,
  isError,
  defaultValue,
}: {
  type: string;
  name: string;
  placeholder: string;
  isError: boolean;
  defaultValue: string | null;
}) {
  const [value, setValue] = useState<string>(defaultValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (type) {
      case "tel":
        function formatPhoneNumber(value: string) {
          const phoneNumber = value.replace(/[^\d]/g, "");
          const match = phoneNumber.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,4})$/);

          if (!match) {
            return phoneNumber;
          } else {
            if (phoneNumber.length === 1) {
              return phoneNumber === "8" || phoneNumber === "7" ? "+7" : `+7 (${match[1]})`;
            } else {
              return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
            }
          }
        }

        setValue((prev) => {
          if (prev.length >= value.length) return value;
          if (value.length > 17) return prev;
          return formatPhoneNumber(value);
        });
        break;
      case "email":
        setValue(value.replace(/[^a-zA-Z0-9@.-]/g, ""));
        break;
      default:
        setValue(value);
        break;
    }
  };

  const validation = () => {
    switch (type) {
      case "tel":
        return /^[+]?[0-9]{1} \([0-9]{3}\) [0-9]{3}-[0-9]{4}$/.test(value);

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      default:
        return value.length > 0;
    }
  };

  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`${isError && !validation() ? style.error : isError && style.success}`}
      />
    </>
  );
}
