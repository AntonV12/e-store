import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/productsActions";
import { SortType } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || process.env.DEFAULT_LIMIT || "20");
    const page = Number(searchParams.get("page")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy: SortType = (searchParams.get("sortBy") as SortType) || "viewed";
    const sortByDirection: "desc" | "asc" = (searchParams.get("sortByDirection") as "desc" | "asc") || "desc";

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
    }

    const data = await fetchProducts(search, limit, page, category, sortBy, sortByDirection);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error", err }, { status: 500 });
  }
}
