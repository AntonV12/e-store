import ProductsList from "@/components/products/ProductsList";
import SearchForm from "@/components/search/SearchForm";
import { Suspense } from "react";
import { fetchCategories } from "@/lib/productsActions";
import { Metadata } from "next";
import { ProductsListSkeleton } from "@/components/skeletons/skeletons";
import SortForm from "@/components/sort/SortForm";
import { parsePath } from "@/utils/parsePath";

export const metadata: Metadata = {
  title: "My Store",
  description: "Интернет-магазин электронных товаров с доставкой по всей России",
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ search: string }>;
}) {
  const categories = (await fetchCategories()) ?? [];
  const pathname = (await params).slug?.join("/") || "";
  const awaitedSearchParams = await searchParams;
  const updatedParams = { ...parsePath(pathname), ...awaitedSearchParams };

  return (
    <>
      <SearchForm categories={categories} />
      <SortForm updatedParams={updatedParams} />
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList searchParams={updatedParams} />
      </Suspense>
    </>
  );
}
