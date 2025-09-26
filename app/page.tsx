import ProductsList from "@/components/products/ProductsList";
import SearchForm from "@/components/search/SearchForm";
import { Suspense } from "react";
import { fetchCategories } from "@/lib/productsActions";
import { SearchParamsType } from "@/lib/types";
import { Metadata } from "next";
import { ProductsListSkeleton } from "@/components/skeletons/skeletons";
import SortForm from "@/components/sort/SortForm";

export const metadata: Metadata = {
  title: "My Store",
};

export default async function Home(props: { searchParams?: Promise<SearchParamsType> }) {
  const searchParams = await props.searchParams;
  const categories = (await fetchCategories()) ?? [];

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
