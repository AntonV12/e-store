import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProducts, createProduct } from "./productsController";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const name = searchParams.get("name") || "";
    const category = searchParams.get("category") || "";

    console.log(searchParams);

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
    }

    const data = await fetchProducts(limit, name, category);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json();
    const createdProduct = await createProduct(product);
    return NextResponse.json(createdProduct);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
