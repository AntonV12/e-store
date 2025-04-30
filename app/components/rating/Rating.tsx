import { ProductType } from "@/lib/types/types";
import style from "./rating.module.css";
import { useUpdateProductMutation } from "@/lib/features/products/productsApiSlice";
import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";

export function RatingArea({ product }: { product: ProductType }) {
  const [updateProduct, { isLoading, isSuccess, isError }] = useUpdateProductMutation();
  const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
  const isRated: boolean = product.rating.some((rating) => rating.author === currentUser?.name);
  const userRating: number = product.rating.find((item) => item.author === currentUser?.name)?.rating || 0;

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (isUserLoading) return;

    if (isUserSuccess) {
      if (!currentUser) return;
      if (isRated) return;

      if (target.tagName === "LABEL") {
        const updatedProduct = {
          ...product,
          rating: [...product.rating, { author: currentUser.name, rating: +target.title }],
        };

        try {
          await updateProduct(updatedProduct).unwrap();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const shouldHighlight = (starValue: number) => {
    return userRating >= starValue;
  };

  return (
    <div className={style.rating} onClick={handleClick}>
      <input type="radio" name="star" id="5" />
      <label htmlFor="5" title="5" className={shouldHighlight(5) ? style.highlighted : ""}>
        &#9733;
      </label>
      <input type="radio" name="star" id="4" />
      <label htmlFor="4" title="4" className={shouldHighlight(4) ? style.highlighted : ""}>
        &#9733;
      </label>
      <input type="radio" name="star" id="3" />
      <label htmlFor="3" title="3" className={shouldHighlight(3) ? style.highlighted : ""}>
        &#9733;
      </label>
      <input type="radio" name="star" id="2" />
      <label htmlFor="2" title="2" className={shouldHighlight(2) ? style.highlighted : ""}>
        &#9733;
      </label>
      <input type="radio" name="star" id="1" />
      <label htmlFor="1" title="1" className={shouldHighlight(1) ? style.highlighted : ""}>
        &#9733;
      </label>
    </div>
  );
}
