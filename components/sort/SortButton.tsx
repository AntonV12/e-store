"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import style from "./sort.module.css";
import { updatePath } from "@/utils/updatePath";
import { SortType } from "@/lib/types";

export default function SortButton({ term, value }: { term: SortType; value: string }) {
  const pathname = usePathname();
  const sortBy =
    decodeURIComponent(pathname.split("/")[pathname.split("/").findIndex((item) => item === "sort") + 1]) || "viewed";
  const sortByDirection =
    decodeURIComponent(pathname.split("/")[pathname.split("/").findIndex((item) => item === "sort") + 2]) || "desc";
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
    const newPath = updatePath(pathname, { sortBy: term, sortByDirection: direction, page: 1 });
    replace(newPath, { scroll: false });
  };

  return (
    <button onClick={handleSort} className={`${term === sortBy && style.active} ${style.sortLink}`}>
      {value} {`${term === sortBy ? (sortByDirection === "asc" ? "↑" : "↓") : ""}`}
    </button>
  );
}
