import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { loginUser } from "./authController";
import { CartType } from "@/lib/types/types";

export async function POST(request: NextRequest) {
  try {
    const body: { name: string; password: string; isAdmin: boolean; cart: CartType[] } = await request.json();
    const { name, password, isAdmin, cart } = body;

    if (!name || !password) {
      return NextResponse.json({ error: "Необходимо ввести имя и пароль" }, { status: 400 });
    }

    const result = await loginUser({ id: null, name, password, isAdmin, cart });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
