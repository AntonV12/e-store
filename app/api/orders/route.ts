import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createOrder } from "./ordersController";
import { verifySession } from "@/app/api/auth/authController";
import { fetchOrdersByUserId, fetchOrders, updateOrder } from "./ordersController";
import CryptoJS from "crypto-js";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, clientId, encryptedOrder, isDone } = body;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;
    const decryptedBody = JSON.parse(CryptoJS.AES.decrypt(encryptedOrder, secretKey).toString(CryptoJS.enc.Utf8));
    const { phone, email, address, products } = decryptedBody;

    if (!clientId || !phone || !email || !address || !products.length) {
      return NextResponse.json({ error: "Недостаточно данных для заказа" }, { status: 400 });
    }

    const result = await createOrder({ id, encryptedOrder, clientId, isDone });
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, param, value } = body;

    if (!id || !param || value === undefined) {
      return NextResponse.json({ error: "Недостаточно данных для обновления заказа" }, { status: 400 });
    }

    const result = await updateOrder({ id, param, value });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
