"use client";

import style from "./rating.module.css";
import { updateRating } from "@/lib/productsActions";

export default function RatingItem({
  title,
  target,
  setTargetAction,
  id,
  clientId,
  isRated,
  setIsRatedAction,
}: {
  title: number;
  target: number;
  setTargetAction: React.Dispatch<React.SetStateAction<number>>;
  id: number | null;
  clientId: string;
  isRated: boolean;
  setIsRatedAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const highlight = (e: React.MouseEvent<HTMLLabelElement>) => {
    const target: HTMLElement = e.target as HTMLElement;

    if (target.closest(`.${style.rating}`)) {
      if (!isRated) setTargetAction(Number(target.title));
    }
  };

  const clear = () => {
    if (!isRated) {
      setTargetAction(0);
    }
  };

  const onSubmit = async (rating: number) => {
    setTargetAction(rating);
    setIsRatedAction(true);

    await updateRating(id, clientId, rating);
  };

  return (
    <>
      <input type="radio" name="star" />
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
