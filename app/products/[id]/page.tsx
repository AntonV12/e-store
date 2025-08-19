import type { Metadata } from "next";
import Product from "@/components/product/Product";
import { verifySession } from "@/lib/authActions";
import { fetchProductById } from "@/lib/productsActions";
import { ProductSkeleton } from "@/components/skeletons/skeletons";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  const p = await params;
  const product = await fetchProductById(p.id);
  return {
    title: product?.name,
    description: product?.description,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const id = params.id;
  // const product = (await fetchProductById(id)) ?? null;
  const session = await verifySession();
  const { isAuth, userId } = session;

  if (!id) {
    return <h1>Product not found</h1>;
  }

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product id={id} isAuth={isAuth} userId={Number(userId)} />
    </Suspense>
  );
}
