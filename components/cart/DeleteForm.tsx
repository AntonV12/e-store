"use client";

import style from "./cart.module.css";
import { deleteProduct } from "@/lib/usersActions";

export default function DeleteForm({ id }: { id: number }) {
	const deleteProductWithId = deleteProduct.bind(null, id);

	return (
		<form action={deleteProductWithId}>
			<button className={style.deleteBtn}>Удалить</button>
		</form>
	);
}
