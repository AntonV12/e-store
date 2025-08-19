"use client";

import style from "./amount.module.css";

export default function Amount({
  value,
  setAmount,
}: {
  value: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleAmountDecrease = () => {
    setAmount((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAmountIncrease = () => {
    setAmount((prev) => prev + 1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value < 1) return;
    setAmount(+e.target.value);
  };

  return (
    <div className={style.amount}>
      <button type="button" onClick={handleAmountDecrease}>
        -
      </button>
      <input
        type="text"
        name="amount"
        value={value}
        onChange={handleAmountChange}
      />
      <button type="button" onClick={handleAmountIncrease}>
        +
      </button>
    </div>
  );
}
