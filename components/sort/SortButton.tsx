"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import style from "./sort.module.css";

export default function SortButton({
	term,
	value,
}: {
	term: string;
	value: string;
}) {
	const searchParams = useSearchParams();
	const sortBy = searchParams.get("sortBy") || "viewed";
	const sortByDirection = searchParams.get("sortByDirection");
	const pathname = usePathname();
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
		replace(`${pathname}?sortBy=${term}&sortByDirection=${direction}`, {
			scroll: false,
		});
	};

	return (
		<button
			onClick={handleSort}
			className={`${term === sortBy && style.active} ${style.sortLink}`}
		>
			{value}{" "}
			{`${term === sortBy ? (sortByDirection === "asc" ? "↑" : "↓") : ""}`}
		</button>
	);
}
