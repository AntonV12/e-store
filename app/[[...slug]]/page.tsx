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
};

export default async function Home({ params }: { params: Promise<{ slug: string[] }> }) {
  const categories = (await fetchCategories()) ?? [];
  const pathname = (await params).slug?.join("/") || "";
  const searchParams = parsePath(pathname);

  return (
    <>
      <SearchForm categories={categories} />
      <SortForm />
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
