"use client";

import { deleteProduct } from "@/lib/productsActions";
import { useActionState, useEffect, useState, startTransition } from "react";
import { DeleteProductState } from "@/lib/types";
import style from "./product.module.css";
import DeleteIcon from "@/public/delete.svg";
import Confirm from "@/components/confirm/Confirm";
import { createPortal } from "react-dom";

export default function DeleteForm({ id, images }: { id: number; images: string[] }) {
	const deleteProductWithId = deleteProduct.bind(null, id);
	const initialState: DeleteProductState = {
		error: null,
		message: "",
		formData: {
			images: images,
		},
	};
	const [state, formAction] = useActionState<DeleteProductState, FormData>(deleteProductWithId, initialState);
	const [isShow, setIsShow] = useState<boolean>(false);

	useEffect(() => {
		if (state?.message) {
			const bc = new BroadcastChannel("products");
			bc.postMessage({
				type: "delete",
				productId: id,
				message: state.message,
			});
			bc.close();

			window.close();
		}
	}, [state?.message, id]);

	const onSubmit = () => {
		startTransition(() => {
			formAction(new FormData());
			setIsShow(false);
		});
	};

	return (
		<>
			<button className={style.deleteButton} onClick={() => setIsShow(true)}>
				<DeleteIcon /> Удалить
			</button>

			{isShow && createPortal(<Confirm action={onSubmit} setIsShow={setIsShow} />, document.body)}
		</>
	);
}
