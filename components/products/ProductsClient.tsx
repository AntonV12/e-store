"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductItem from "./ProductItem";
import { ProductType, SearchParamsType } from "@/lib/types";
import style from "./products.module.css";

export default function ProductsClient({
  initialProducts,
  searchParams,
}: {
  initialProducts: { products: ProductType[]; count: number };
  searchParams?: SearchParamsType;
}) {
  const lastItemRef = useRef<HTMLLIElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [products, setProducts] = useState(initialProducts.products);
  const totalPages = initialProducts.count;
  const [page, setPage] = useState<number>(Number(searchParams?.page) || 1);

  useEffect(() => {
    setProducts(initialProducts.products);
  }, [initialProducts.products]);

  useEffect(() => {
    const newPage = Number(searchParams?.page) || 1;
    setPage(newPage);
  }, [searchParams?.page, searchParams?.sortBy, searchParams?.sortByDirection]);

  const handleLoadMore = useCallback(async () => {
    if (page >= totalPages) return;

    const params = new URLSearchParams({
      ...searchParams,
      page: String(page + 1),
    });

    const res = await fetch(`/api/products?${params.toString()}`);

    if (!res.ok) return;

    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    setPage((prev) => prev + 1);
  }, [page, totalPages, searchParams]);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  useEffect(() => {
    const restoreScroll = () => {
      const savedScroll = sessionStorage.getItem("scrollPosition");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, Number(savedScroll));
        }, 0);
      }
    };

    if (typeof window !== "undefined") {
      restoreScroll();
    }
  }, []);

  useEffect(() => {
    if (!lastItemRef.current || !products || page >= totalPages) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(callback);

    observer.current.observe(lastItemRef.current);

    return () => observer.current?.disconnect();
  }, [products, callback, page, totalPages]);

  return (
    <section className={style.products}>
      <ul className={style.list}>
        {products.map((p, index) => (
          <ProductItem
            key={p.id}
            product={p}
            ref={index === products.length - 1 ? lastItemRef : null}
          />
        ))}
      </ul>
    </section>
  );
}

// import { useEffect, useState, useRef, useCallback } from "react";
// import ProductItem from "./ProductItem";
// import { ProductType, SearchParamsType } from "@/lib/types";
// import style from "./products.module.css";

// export default function ProductsClient({
//   initialProducts,
//   searchParams,
// }: {
//   initialProducts: ProductType[];
//   searchParams?: SearchParamsType;
// }) {
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [limit, setLimit] = useState(Number(searchParams?.limit) || 10);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const lastItemRef = useRef<HTMLLIElement>(null);
//   const observer = useRef<IntersectionObserver | null>(null);

//   useEffect(() => {
//     setProducts(initialProducts);
//   }, [initialProducts]);

//   const handleLoadMore = useCallback(async () => {
//     if (isLoading || !hasMore) return;
//     setIsLoading(true);

//     const newLimit = limit + 10;
//     const params = new URLSearchParams({
//       ...searchParams,
//       limit: String(newLimit),
//     });

//     const res = await fetch(`/api/products?${params.toString()}`);
//     const data: ProductType[] = await res.json();

//     if (data.length === products.length) {
//       setHasMore(false);
//     } else {
//       setProducts(data);
//       setLimit(newLimit);
//       document.cookie = `limit=${newLimit}; path=/`;
//     }

//     setIsLoading(false);
//   }, [hasMore, isLoading, limit, products.length, searchParams]);

//   const callback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       if (entries[0].isIntersecting) {
//         handleLoadMore();
//       }
//     },
//     [handleLoadMore]
//   );

//   useEffect(() => {
//     const restoreScroll = () => {
//       const savedScroll = sessionStorage.getItem("scrollPosition");
//       if (savedScroll) {
//         setTimeout(() => {
//           window.scrollTo(0, Number(savedScroll));
//         }, 0);
//       }
//     };

//     if (typeof window !== "undefined") {
//       restoreScroll();
//     }
//   }, []);

//   useEffect(() => {
//     if (!lastItemRef.current || !products || products.length < limit) return;
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver(callback);

//     observer.current.observe(lastItemRef.current);

//     return () => observer.current?.disconnect();
//   }, [products, callback, limit]);

//   if (!products.length) {
//     return (
//       <section className={style.products}>
//         <p>Ничего не найдено</p>
//       </section>
//     );
//   }

//   return (
//     <section className={style.products}>
//       <ul className={style.list}>
//         {products.map((p, index) => (
//           <ProductItem key={p.id} product={p} ref={index === products.length - 1 ? lastItemRef : null} />
//         ))}
//       </ul>
//       {isLoading && <p>Загрузка...</p>}
//     </section>
//   );
// }
