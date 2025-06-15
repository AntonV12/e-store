import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { /* fetchUsers, */ createUser } from "./usersController";
import { CartType } from "@/lib/types/types";

/* export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
    }

    const data = await fetchUsers(limit);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} */

export async function POST(request: NextRequest) {
  try {
    const body: { name: string; password: string; isAdmin: boolean; cart: CartType[]; avatar: string } =
      await request.json();
    const { name, password, isAdmin, cart, avatar } = body;

    if (!name || !password) {
      return NextResponse.json({ error: "Необходимо ввести имя и пароль" }, { status: 400 });
    }

    const result = await createUser({ id: null, name, password, isAdmin, cart, avatar });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
