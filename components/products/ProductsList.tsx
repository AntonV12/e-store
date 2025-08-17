import ProductsClient from "./ProductsClient";
import { fetchProducts } from "@/lib/productsActions";
import { ProductType, SearchParamsType } from "@/lib/types";

export default async function ProductsList({ searchParams }: { searchParams?: SearchParamsType }) {
  const { name, limit, category, sortBy, sortByDirection } = searchParams ?? {};
  const products: ProductType[] = (await fetchProducts(name, limit, category, sortBy, sortByDirection)) ?? [];

  return <ProductsClient initialProducts={products} searchParams={searchParams} />;
}
