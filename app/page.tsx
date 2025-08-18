import ProductsList from "@/components/products/ProductsList";
import SearchForm from "@/components/search/SearchForm";
import { Suspense } from "react";
import { fetchCategories } from "@/lib/productsActions";
import { SearchParamsType } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Store",
};

export default async function Home(props: {
  searchParams?: Promise<SearchParamsType>;
}) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const categories = (await fetchCategories()) ?? [];

  return (
    <>
      <SearchForm categories={categories} />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
