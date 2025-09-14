"use client";

import style from "./rating.module.css";
import { useState } from "react";
import RatingItem from "./RatingItem";

export default function RatingArea({ id, clientId, rating }: { id: number | null; clientId: string; rating: number }) {
  const [target, setTarget] = useState<number>(rating);
  const [isRated, setIsRated] = useState<boolean>(!!target);

  return (
    <div className={style.rating}>
      <RatingItem
        title={5}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={4}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={3}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={2}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={1}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
    </div>
  );
}
