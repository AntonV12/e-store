"use client";

import { useEffect, useActionState } from "react";
import { LogoutStateType } from "@/lib/types";
import { logoutUser } from "@/lib/authActions";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
	const initialState = {
		error: null,
		message: null,
	};
	const [state, formAction] = useActionState<LogoutStateType>(logoutUser, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message) {
			setTimeout(() => {
				const bc = new BroadcastChannel("cart");
				bc.postMessage({
					type: "clear",
				});

				bc.close();
				router.push("/");
			}, 0);
		}
	}, [state.message, router]);

	return (
		<form action={formAction}>
			<button type="submit">Выйти из системы</button>
		</form>
	);
}
