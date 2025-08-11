import type { Metadata } from "next";
import ProductsList from "@/components/products/ProductsList";
import SearchForm from "@/components/SearchForm";
import Categories from "@/components/categories/Categories";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function IndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search;

  return (
    <>
      <SearchForm initialValue={searchQuery || ""} />
      <ProductsList searchQuery={searchQuery} />
    </>
  );
}

export const metadata: Metadata = {
  title: "My Store",
  description: "Интернет-магазин электронных товаров с доставкой по всей России",
};
