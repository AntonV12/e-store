import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProductById, updateProduct } from "./productController";
import { ProductType } from "@/lib/types/types";

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const data = await fetchProductById(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: ProductType = await request.json();
    const result = await updateProduct(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
