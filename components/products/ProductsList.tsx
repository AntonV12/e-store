import ProductsClient from "./ProductsClient";
import { fetchProducts } from "@/lib/productsActions";
import { SearchParamsType, ProductType } from "@/lib/types";

export default async function ProductsList({ params }: { params?: string[] }) {
  // const { name, limit, page, category, sortBy, sortByDirection } = searchParams ?? {};
  // const products = (await fetchProducts(name, limit, page, category, sortBy, sortByDirection)) ?? [];
  const [name, category, sortBy, sortByDirection] = params as string[];
  const products = (await fetchProducts(name, 10, 0, category, sortBy, sortByDirection)) ?? [];
  console.log(products);

  // return (
  //   <ProductsClient
  //     initialProducts={products as { products: ProductType[]; count: number }}
  //     params={params}
  //   />
  // );

  return <pre>{products.products}</pre>;
}
