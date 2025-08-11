import { ProductType } from "@/lib/types/types";
import { fetchProducts } from "@/app/api/products/productsController";
import ProductItem from "./ProductItem";
import style from "./products.module.css";

export default async function ProductList({ searchQuery }: { searchQuery?: string }) {
  const products: ProductType[] | null = await fetchProducts(10, searchQuery);

  return (
    <section className={style.products}>
      <ul className={style.list}>
        {products?.map((product, index) => (
          <ProductItem key={product.id} product={product} /* ref={index === data.length - 1 ? lastItemRef : null} */ />
        ))}
      </ul>
    </section>
  );
}

/* "use client";
import { useGetProductsQuery } from "@/lib/features/products/productsApiSlice";
import style from "./products.module.css";
import { SearchForm } from "../SearchForm";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/lib/hooks";
import Categories from "@/components/categories/Categories";
import ProductItem from "./ProductItem";
import { ProductsListSkeleton } from "@/components/skeletons/skeletons";
import { SortType } from "@/lib/types/types";

export const ProductsList = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 500);
  const [initialized, setInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<SortType>("viewed");
  const [sortByDirection, setSortByDirection] = useState<"asc" | "desc">("desc");
  const { data, isError, isLoading, isSuccess } = useGetProductsQuery(
    {
      limit,
      name: debouncedValue,
      category: selectedCategory,
      sortBy,
      sortByDirection,
    },
    { skip: !initialized }
  );
  const [isShowCategories, setIsShowCategories] = useState(false);
  const lastItemRef = useRef<HTMLLIElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const savedLimit: number = Number(sessionStorage.getItem("productLimit"));
    const savedSortBy = sessionStorage.getItem("productSortBy") as SortType;
    const savedSortByDirection = sessionStorage.getItem("productSortByDirection") as "asc" | "desc";
    const savedSelectedCategory = sessionStorage.getItem("productSelectedCategory");

    if (savedLimit) setLimit(savedLimit);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedSortByDirection) setSortByDirection(savedSortByDirection);
    if (savedSelectedCategory) setSelectedCategory(savedSelectedCategory);

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

    setInitialized(true);
  }, []);

  const toggleCategories = () => {
    setIsShowCategories((prev) => !prev);
  };

  const handleLoadMore = () => {
    sessionStorage.setItem("productLimit", String(limit + 10));
    setLimit((prev) => prev + 10);
  };

  const callback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      handleLoadMore();
    }
  };

  useEffect(() => {
    if (!lastItemRef.current || !data || data.length < limit) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(callback);

    observer.current.observe(lastItemRef.current);

    return () => observer.current?.disconnect();
  }, [data]);

  const handleSort = (sortBy: SortType) => {
    setSortBy((prev) => {
      if (prev === sortBy) {
        const newSortByDirection = sortByDirection === "asc" ? "desc" : "asc";
        setSortByDirection(newSortByDirection);
        sessionStorage.setItem("productSortByDirection", newSortByDirection);
      } else {
        if (sortBy === "cost" || sortBy === "name") {
          setSortByDirection("asc");
          sessionStorage.setItem("productSortByDirection", "asc");
        } else {
          setSortByDirection("desc");
          sessionStorage.setItem("productSortByDirection", "desc");
        }
      }
      return sortBy;
    });

    sessionStorage.setItem("productSortBy", sortBy);
  };

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return <ProductsListSkeleton />;
  }

  if (isSuccess) {
    return (
      <section className={style.products}>
        <SearchForm value={value} setValue={setValue} toggleCategories={toggleCategories} />

        <div className={style.sort}>
          <button
            onClick={() => handleSort("cost")}
            className={`${sortBy === "cost" && style.active} ${style.sortButton}`}
          >
            цена {sortBy === "cost" && (sortByDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("name")}
            className={`${sortBy === "name" && style.active} ${style.sortButton}`}
          >
            название {sortBy === "name" && (sortByDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("rating")}
            className={`${sortBy === "rating" && style.active} ${style.sortButton}`}
          >
            рейтинг {sortBy === "rating" && (sortByDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("viewed")}
            className={`${sortBy === "viewed" && style.active} ${style.sortButton}`}
          >
            популярность {sortBy === "viewed" && (sortByDirection === "asc" ? "↑" : "↓")}
          </button>
        </div>

        {data.length === 0 && <p>Товаров не найдено</p>}

        <ul className={style.list}>
          {data.map((product, index) => (
            <ProductItem key={product.id} product={product} ref={index === data.length - 1 ? lastItemRef : null} />
          ))}
        </ul>
        {isShowCategories && (
          <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}
      </section>
    );
  }

  return null;
};
 */
