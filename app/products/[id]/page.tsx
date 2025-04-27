import type { Metadata } from "next";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import Product from "@/app/components/product/Product";

export const metadata: Metadata = {
  title: "Product page",
};

export default async function ProductPage(props: { params: { id: number } }) {
  const params = await props.params;
  const id = params.id;

  return (
    <div>
      <Product id={id} />
    </div>
  );
}
