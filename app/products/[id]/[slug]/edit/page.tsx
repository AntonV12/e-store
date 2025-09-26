import type { Metadata } from "next";
import { verifySession } from "@/lib/authActions";
import { fetchProductById } from "@/lib/productsActions";
import { SessionType, ProductType } from "@/lib/types";
import AddProduct from "@/components/add-product/AddProduct";

export async function generateMetadata({ params }: { params: Promise<{ id: number }> }): Promise<Metadata> {
  const p = await params;
  const product = await fetchProductById(p.id);

  return {
    title: `${product?.name} | Редактировать`,
    description: product?.description,
  };
}

export default async function ProductEditPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const session: SessionType | null = await verifySession();
  const product: ProductType | null = await fetchProductById(id);

  if (!session.isAdmin) {
    return <h1>Вы не можете редактировать</h1>;
  }

  if (!id) {
    return <h1>Продукт не найден</h1>;
  }

  return <AddProduct product={product!} isEdit={true} />;
}
