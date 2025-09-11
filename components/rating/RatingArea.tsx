"use client";

import { CartType } from "@/lib/types";
import style from "./rating.module.css";
import { useState } from "react";
import RatingItem from "./RatingItem";

export default function RatingArea({
  id,
  clientId,
  rating,
}: {
  id: number;
  clientId: string;
  rating: number;
}) {
  const [target, setTarget] = useState<number>(rating);
  const [isRated, setIsRated] = useState<boolean>(!!target);

  return (
    <div className={style.rating}>
      <RatingItem
        title={5}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={4}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={3}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={2}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
      <RatingItem
        title={1}
        target={target}
        setTarget={setTarget}
        id={id}
        clientId={clientId}
        isRated={isRated}
        setIsRated={setIsRated}
      />
    </div>
  );
}

// import { CartType } from "@/lib/types";
// import style from "./rating.module.css";
// import { useUpdateViewedMutation, useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
// import { useGetCurrentUserQuery } from "@/lib/features/auth/authApiSlice";
// import { useAppDispatch } from "@/lib/hooks";
// import { setMessage } from "@/lib/features/message/messageSlice";
// import { useState, useEffect } from "react";

// export function RatingArea({ product }: { product: CartType }) {
//   const dispatch = useAppDispatch();
//   const { data: currentUser, isLoading: isUserLoading, isSuccess: isUserSuccess } = useGetCurrentUserQuery();
//   const [updateViewed] = useUpdateViewedMutation();
//   const { data: productById } = useGetProductByIdQuery(product.id ?? 0);
//   const [userRating, setUserRating] = useState<{ author: number; rating: number } | null | undefined>(null);

//   useEffect(() => {
//     if (productById) {
//       setUserRating(productById?.rating.find((rating) => rating.author === currentUser?.id));
//     }
//   }, [productById]);

//   const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
//     const target = e.target as HTMLElement;

//     if (isUserLoading) return;
//     if (userRating?.rating) return;
//     if (isUserSuccess) {
//       if (!currentUser) return;

//       if (target.tagName === "LABEL") {
//         try {
//           if (!product.id) return;
//           target.classList.add(style.highlighted);
//           if (currentUser.id) {
//             setUserRating({ author: currentUser?.id, rating: +target.title });
//             await updateViewed({ id: product.id, params: { rating: +target.title } }).unwrap();
//             dispatch(setMessage("Спасибо за оценку"));
//           }
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   };

//   const shouldHighlight = (starValue: number) => {
//     if (!userRating) return false;
//     return userRating?.rating >= starValue;
//   };

//   return (
//     <div className={style.rating} onClick={handleClick}>
//       <input type="radio" name="star" disabled={userRating ? true : false} />
//       <label htmlFor="5" title="5" className={shouldHighlight(5) ? style.highlighted : ""}>
//         &#9733;
//       </label>
//       <input type="radio" name="star" disabled={userRating ? true : false} />
//       <label htmlFor="4" title="4" className={shouldHighlight(4) ? style.highlighted : ""}>
//         &#9733;
//       </label>
//       <input type="radio" name="star" disabled={userRating ? true : false} />
//       <label htmlFor="3" title="3" className={shouldHighlight(3) ? style.highlighted : ""}>
//         &#9733;
//       </label>
//       <input type="radio" name="star" disabled={userRating ? true : false} />
//       <label htmlFor="2" title="2" className={shouldHighlight(2) ? style.highlighted : ""}>
//         &#9733;
//       </label>
//       <input type="radio" name="star" disabled={userRating ? true : false} />
//       <label htmlFor="1" title="1" className={shouldHighlight(1) ? style.highlighted : ""}>
//         &#9733;
//       </label>
//     </div>
//   );
// }
