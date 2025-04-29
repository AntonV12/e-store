import type { Metadata } from "next";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";
import Product from "@/app/components/product/Product";
import { verifySession } from "@/app/api/auth/authController";

export const metadata: Metadata = {
  title: "Product page",
};

export default async function ProductPage(props: { params: { id: number } }) {
  const params = await props.params;
  const id = params.id;
  const session = await verifySession();
  const isAuth: boolean = session.isAuth as boolean;

  return (
    <div>
      <Product id={id} isAuth={isAuth} />
    </div>
  );
}
