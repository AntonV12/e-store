"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductItem from "./ProductItem";
import { ProductType, SearchParamsType } from "@/lib/types";
import style from "./products.module.css";

export default function ProductsClient({
  initialProducts,
  searchParams,
}: {
  initialProducts: ProductType[];
  searchParams?: SearchParamsType;
}) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [limit, setLimit] = useState(Number(searchParams?.limit) || 10);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef<HTMLLIElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const newLimit = limit + 10;
    const params = new URLSearchParams({
      ...searchParams,
      limit: String(newLimit),
    });
    console.log('params', `/api/products?${params.toString()}`)

    const res = await fetch(`/api/products?${params.toString()}`);
    const data: ProductType[] = await res.json();

    if (data.length === products.length) {
      setHasMore(false);
    } else {
      setProducts(data);
      setLimit(newLimit);
      document.cookie = `limit=${newLimit}; path=/`;
    }

    setIsLoading(false);
  }, [hasMore, isLoading, limit, products.length, searchParams]);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    },
    [handleLoadMore]
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
    if (!lastItemRef.current || !products || products.length < limit) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(callback);

    observer.current.observe(lastItemRef.current);

    return () => observer.current?.disconnect();
  }, [products, callback, limit]);

  return (
    <section className={style.products}>
      <ul className={style.list}>
        {products.map((p, index) => (
          <ProductItem key={p.id} product={p} ref={index === products.length - 1 ? lastItemRef : null} />
        ))}
      </ul>
      {isLoading && <p>Загрузка...</p>}
      {!hasMore && <p>Все товары загружены</p>}
    </section>
  );
}
