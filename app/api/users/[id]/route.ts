import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchUserById } from "./userController";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "1");
    console.log("id", searchParams.get("id"));

    const data = await fetchUserById(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
