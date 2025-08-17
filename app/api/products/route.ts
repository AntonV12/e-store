import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProducts, createProduct } from "./productsController";
import { SortType } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const name = searchParams.get("name") || "";
    const category = searchParams.get("category") || "";
    const sortBy: SortType = (searchParams.get("sortBy") as SortType) || "viewed";
    const sortByDirection: "desc" | "asc" = (searchParams.get("sortByDirection") as "desc" | "asc") || "desc";

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
    }

    const data = await fetchProducts(name, limit, category, sortBy, sortByDirection);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();

//     const createdProduct = await createProduct(formData);
//     return NextResponse.json(createdProduct);
//   } catch (err) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
