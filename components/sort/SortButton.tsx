"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import style from "./sort.module.css";
import { updatePath } from "@/utils/updatePath";
import { SortType, SearchParamsType } from "@/lib/types";

export default function SortButton({
  term,
  value,
  updatedParams,
}: {
  term: SortType;
  value: string;
  updatedParams: SearchParamsType;
}) {
  const pathname = usePathname();
  const { sortBy = "viewed", sortByDirection, search } = updatedParams;
  const { replace } = useRouter();
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (term === sortBy) {
      if (sortByDirection === "asc") {
        setDirection("desc");
      } else {
        setDirection("asc");
      }
    } else {
      if (term === "viewed" || term === "rating") {
        setDirection("desc");
      } else {
        setDirection("asc");
      }
    }
  }, [term, sortBy, sortByDirection]);

  const handleSort = () => {
    const newPath = `${updatePath(pathname, { sortBy: term, sortByDirection: direction, page: 1 })}${search ? `?search=${search || ""}` : ""}`;
    replace(newPath, { scroll: false });
  };

  return (
    <button onClick={handleSort} className={`${term === sortBy ? style.active : ""} ${style.sortLink}`}>
      {value} {`${term === sortBy ? (sortByDirection === "asc" ? "↑" : "↓") : ""}`}
    </button>
  );
}
