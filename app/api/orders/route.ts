import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOrder } from "./ordersController";
import { verifySession } from "@/app/api/auth/authController";
import { fetchOrdersByUserId, fetchOrders, updateOrder } from "./ordersController";

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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const done = searchParams.get("done") === "true";
    const { userId, isAdmin } = session;
    const data = isAdmin ? await fetchOrders(limit, done) : await fetchOrdersByUserId(userId as number, limit, done);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, clientId, phone, email, address, products, isDone, date } = body;

    if (!id || !clientId || !phone || !email || !address || !products.length) {
      return NextResponse.json({ error: "Недостаточно данных для обновления заказа" }, { status: 400 });
    }

    const result = await updateOrder({
      id,
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
