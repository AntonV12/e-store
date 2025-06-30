import type { Metadata } from "next";
import Product from "@/components/product/Product";
import { verifySession } from "@/app/api/auth/authController";

export const metadata: Metadata = {
  title: "Product page",
};

export default async function ProductPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const session = await verifySession();
  const isAuth: boolean = session.isAuth;

  return <Product id={id} isAuth={isAuth} />;
}
