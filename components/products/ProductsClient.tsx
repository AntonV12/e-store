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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setProducts(initialProducts.products);
  }, [initialProducts.products]);

  useEffect(() => {
    const newPage = Number(searchParams?.page) || 1;
    setPage(newPage);
  }, [searchParams]);

  useEffect(() => {
    const bc = new BroadcastChannel("products");

    bc.onmessage = (event) => {
      if (event.data.type === "update") {
        const updatedProduct = event.data.product;
        setProducts((prev) =>
          prev.map((product) => {
            if (product.id === updatedProduct.id) {
              return updatedProduct;
            } else {
              return product;
            }
          })
        );
      } /* else if (event.data.type === "delete") {
        const { productId } = event.data;

        setCart((prev) =>
          prev.filter((item) => {
            return item.productId !== productId;
          }),
        );
      } */
    };

    return () => bc.close();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (page >= totalPages || products.length / 10 >= totalPages) return;
    setIsLoading(true);

    const params = new URLSearchParams({
      page: String(page + 1),
      name: searchParams?.name || "",
      limit: searchParams?.limit?.toString() || "10",
      category: searchParams?.category || "",
      sortBy: searchParams?.sortBy || "viewed",
      sortByDirection: searchParams?.sortByDirection || "desc",
    });

    const res = await fetch(`/api/products?${params.toString()}`);

    if (!res.ok) return;

    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    const newPage = page + 1;
    setPage(newPage);
    setIsLoading(false);
  }, [page, totalPages, searchParams, products.length]);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    },
    [handleLoadMore]
  );

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
          <ProductItem key={p.id} product={p} ref={index === products.length - 1 ? lastItemRef : null} />
        ))}
      </ul>
      {isLoading && <div>loading...</div>}
    </section>
  );
}
