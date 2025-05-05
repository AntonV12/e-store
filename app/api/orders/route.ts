import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOrder } from "./ordersController";
import { verifySession } from "@/app/api/auth/authController";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, phone, email, address, products } = body;

    if (!clientId || !phone || !email || !address || !products.length) {
      return NextResponse.json({ error: "Недостаточно данных для заказа" }, { status: 400 });
    }

    const result = await createOrder(body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
