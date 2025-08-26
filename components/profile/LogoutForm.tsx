import { deleteSession } from "@/lib/sessions";

export default function LogoutForm() {
	return (
		<form action={deleteSession}>
			<button type="submit">Выйти из системы</button>
		</form>
	);
}
