import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchCategories } from "./categoriesController";

export async function GET() {
  try {
    const data = await fetchCategories();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
