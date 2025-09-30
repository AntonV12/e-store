import { ProductType } from "@/lib/types";
import { fetchProductById } from "@/lib/productsActions";
import ProductClient from "./ProductClient";

export default async function Product({
  id,
  isAuth,
  userId,
  isAdmin,
}: {
  id: number;
  isAuth: boolean;
  userId: string | null;
  isAdmin: boolean;
}) {
  const product: ProductType | null = (await fetchProductById(id)) ?? null;
  if (!product?.id) return <h1>Продукт не найден</h1>;

  return <ProductClient product={product} isAuth={isAuth} userId={userId} isAdmin={isAdmin} />;
}
