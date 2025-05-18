import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOrder } from "./ordersController";
import { verifySession } from "@/app/api/auth/authController";
import { fetchOrdersByUserId } from "./ordersController";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, phone, email, address, products, isDone, date } = body;

    if (!clientId || !phone || !email || !address || !products.length) {
      return NextResponse.json({ error: "Недостаточно данных для заказа" }, { status: 400 });
    }

    const result = await createOrder({
      id: null,
      clientId,
      phone,
      email,
      address,
      products,
      isDone,
      date,
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await verifySession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = session;
    const data = await fetchOrdersByUserId(userId as number);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
