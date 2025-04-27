"use client";

import Link from "next/link";
import { ProductType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/lib/features/products/productsApiSlice";

export default function Product({ id }: { id: number }) {
  const router = useRouter();

  const { data, isError, isLoading, isSuccess } = useGetProductByIdQuery(id);

  console.log(data);

  return <div>Product page id: {id}</div>;
}
