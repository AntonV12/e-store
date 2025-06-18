import type { Metadata } from "next";
import { ProductsList } from "@/app/components/products/ProductsList";

export default function IndexPage() {
  return <ProductsList />;
}

export const metadata: Metadata = {
  title: "My Store",
  description: "Интернет-магазин электронных товаров с доставкой по всей России",
};
