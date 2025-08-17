import type { Metadata } from "next";
import Product from "@/components/product/Product";
import { verifySession } from "@/lib/authActions";
import { fetchProductById } from "@/lib/productsActions";

export const metadata: Metadata = {
  title: "Product page",
};

export default async function ProductPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const product = (await fetchProductById(id)) ?? null;
  const session = await verifySession();
  const { isAuth, userId } = session;

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return <Product product={product} isAuth={isAuth} userId={Number(userId)} />;
}
