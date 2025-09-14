"use client";

import style from "./rating.module.css";
import { updateRating } from "@/lib/productsActions";

export default function RatingItem({
  title,
  target,
  setTarget,
  id,
  clientId,
  isRated,
  setIsRated,
}: {
  title: number;
  target: number;
  setTarget: React.Dispatch<React.SetStateAction<number>>;
  id: number | null;
  clientId: string;
  isRated: boolean;
  setIsRated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const highlight = (e: React.MouseEvent<HTMLLabelElement>) => {
    const target: HTMLElement = e.target as HTMLElement;

    if (target.closest(`.${style.rating}`)) {
      if (!isRated) setTarget(Number(target.title));
    }
  };

  const clear = () => {
    if (!isRated) {
      setTarget(0);
    }
  };

  const onSubmit = async (rating: number) => {
    if (isRated) return;

    setTarget(rating);
    await updateRating(id, clientId, rating);
    setIsRated(true);
  };

  return (
    <>
      <input type="radio" name="star" disabled={isRated} />
      <label
        htmlFor={title.toString()}
        title={title.toString()}
        className={`${target >= title ? style.highlighted : ""}`}
        onMouseEnter={highlight}
        onMouseLeave={clear}
        onClick={() => onSubmit(title)}
      >
        &#9733;
      </label>
    </>
  );
}
