"use client";

import style from "./product.module.css";
import Slider from "@/components/slider/Slider";
import Form from "./Form";
import CommentsList from "@/components/comments/CommentsList";
import AddCommentForm from "@/components/comments/AddCommentForm";
import Link from "next/link";
import DeleteForm from "./DeleteForm";
import EditIcon from "@/public/edit.svg";
import { ProductType } from "@/lib/types";
import { useEffect } from "react";
import { translit } from "@/utils/translit";

export default function ProductClient({
	product,
	isAuth,
	userId,
	isAdmin,
}: {
	product: ProductType;
	isAuth: boolean;
	userId: string | null;
	isAdmin: boolean;
}) {
	useEffect(() => {
		async function updateViewed() {
			const res = await fetch(`/api/products/${product.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) return;

			const bc = new BroadcastChannel("products");
			bc.postMessage({
				type: "update",
				product: { ...product, viewed: product.viewed + 1 },
			});
			bc.close();
		}

		const timeout = setTimeout(() => {
			updateViewed();
		}, 3000);

		return () => clearTimeout(timeout);
	}, [product]);

	return (
		<section className={style.productCard}>
			<div className={style.container}>
				<div className={style.imgContainer}>
					<div className={style.sliderContainer}>
						<Slider images={product.imageSrc} />
					</div>

					{isAdmin ? (
						<div className={style.editButtons}>
							<Link href={`/products/${product.id}/${translit(product.name)}/edit`}>
								<EditIcon /> Редактировать
							</Link>
							<DeleteForm id={product.id} images={product.imageSrc} />
						</div>
					) : null}
				</div>

				<div className={style.info}>
					<div className={style.title}>
						<h1 className={style.productName}>{product.name}</h1>
						<p className={style.rating}>
							Общий рейтинг: {product.rating.toFixed(1)}
							<span className={style.star}>&#9733;</span>
						</p>
					</div>
					<div className={style.price}>
						<Form product={product} userId={userId} />
					</div>
					<div dangerouslySetInnerHTML={{ __html: product.description }} className={style.description}></div>
				</div>
			</div>

			<CommentsList comments={product.comments} />

			{isAuth ? (
				<AddCommentForm product={product} userId={userId} />
			) : (
				<p>Чтобы оставить комментарий, войдите в свою учетную запись</p>
			)}
		</section>
	);
}
