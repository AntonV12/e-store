import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchProductById, updateProduct, deleteProduct, updateViewed } from "./productController";
import { ProductType } from "@/lib/types/types";
import { verifySession } from "@/app/api/auth/authController";

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const data = await fetchProductById(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await verifySession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    /* const body: ProductType = await request.json();
    const { success, message } = await updateProduct(body); */
    const formData = await request.formData();
    const updatedProduct = await updateProduct(formData);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    /* if (!success) {
      return NextResponse.json({ error: message }, { status: 400 });
    } */

    return NextResponse.json({ success: true, message: updatedProduct });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await verifySession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const { success, message } = await deleteProduct(id);

    if (!success) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.pathname.split("/").pop());
    const params = await request.json();
    await updateViewed(id, params);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
