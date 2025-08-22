"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ToggleButton() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const done = searchParams.get("done") === "true";

	const toggleDone = () => {
		router.replace(`/profile?done=${!done}`, { scroll: false });
	};

	return (
		<button onClick={toggleDone}>
			{done ? "Показать активные" : "Показать завершенные"}
		</button>
	);
}
