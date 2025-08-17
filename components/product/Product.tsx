import { ProductType } from "@/lib/types";
import style from "./product.module.css";
import Slider from "@/components/slider/Slider";
import Form from "./Form";
import CommentsList from "@/components/comments/CommentsList";
import AddCommentForm from "@/components/comments/AddCommentForm";

export default function Product({
  product,
  isAuth,
  userId,
}: {
  product: ProductType;
  isAuth: boolean;
  userId: number;
}) {
  return (
    <section className={style.productCard}>
      <div className={style.container}>
        <div className={style.imgContainer}>
          <Slider images={product.imageSrc} />
        </div>
        <div className={style.info}>
          <div className={style.title}>
            <h1 className={style.productName}>{product.name}</h1>
            <p className={style.rating}>
              Общий рейтинг:{" "}
              {product?.rating.reduce((acc, rating) => acc + rating.rating, 0) / product?.rating.length || 0}{" "}
              <span className={style.star}>&#9733;</span>
            </p>
          </div>
          <div className={style.price}>
            <Form product={product} userId={userId} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: product.description }} className={style.description}></div>
        </div>
      </div>

      {isAuth && <AddCommentForm product={product} userId={userId} />}
      <CommentsList comments={product.comments} />
    </section>
  );
}
