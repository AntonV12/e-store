import ProductsClient from "./ProductsClient";
import { fetchProducts } from "@/lib/productsActions";
import { SearchParamsType, ProductType } from "@/lib/types";

export default async function ProductsList({ searchParams }: { searchParams?: SearchParamsType }) {
  const { search, limit, page, category, sortBy, sortByDirection } = searchParams ?? {};
  const products = (await fetchProducts(search, limit, page, category, sortBy, sortByDirection)) ?? [];

  return (
    <ProductsClient
      initialProducts={products as { products: ProductType[]; count: number }}
      searchParams={searchParams}
    />
  );
}
