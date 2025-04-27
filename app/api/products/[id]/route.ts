import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProductById } from "./productController";

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const data = await fetchProductById(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
