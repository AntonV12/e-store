import type { Metadata } from "next";
import Product from "@/components/product/Product";
import { verifySession } from "@/lib/authActions";
import { fetchProductById } from "@/lib/productsActions";
import { ProductSkeleton } from "@/components/skeletons/skeletons";
import { Suspense } from "react";
import { SessionType } from "@/lib/types";

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
  const p = await params;
  const product = await fetchProductById(p.id);

  return {
    title: product?.name,
    description: product?.description,
  };
}

export default async function ProductPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const session: SessionType | null = await verifySession();

  if (!session) {
    return <h1>Session not found</h1>;
  }

  const { isAuth, userId }: SessionType = session;

  if (!id) {
    return <h1>Product not found</h1>;
  }

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product id={id} isAuth={isAuth} userId={userId} />
    </Suspense>
  );
}
