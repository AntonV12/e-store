"use client";

import style from "./rating.module.css";
import { useState } from "react";
import RatingItem from "./RatingItem";

export default function RatingArea({ id, clientId, rating }: { id: number | null; clientId: string; rating: number }) {
  const [target, setTargetAction] = useState<number>(rating);
  const [isRated, setIsRatedAction] = useState<boolean>(!!target);

  return (
    <div className={style.rating}>
      <RatingItem
        title={5}
        target={target}
        setTargetAction={setTargetAction}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRatedAction={setIsRatedAction}
      />
      <RatingItem
        title={4}
        target={target}
        setTargetAction={setTargetAction}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRatedAction={setIsRatedAction}
      />
      <RatingItem
        title={3}
        target={target}
        setTargetAction={setTargetAction}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRatedAction={setIsRatedAction}
      />
      <RatingItem
        title={2}
        target={target}
        setTargetAction={setTargetAction}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRatedAction={setIsRatedAction}
      />
      <RatingItem
        title={1}
        target={target}
        setTargetAction={setTargetAction}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRatedAction={setIsRatedAction}
      />
    </div>
  );
}
