"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ToggleButton() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const done = searchParams.get("done") === "true";

	const toggleDone = () => {
		router.replace(`${pathname}?done=${!done}`, { scroll: false });
	};

	return (
		<button onClick={toggleDone}>
			{done ? "Показать активные" : "Показать завершенные"}
		</button>
	);
}
