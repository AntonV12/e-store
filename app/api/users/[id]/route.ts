import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateUser } from "./userController";
import { UserType } from "@/lib/types/types";
import { verifySession } from "@/app/api/auth/authController";

export async function PUT(request: NextRequest) {
  const session = await verifySession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: UserType = await request.json();
    const { success, message } = await updateUser(body);

    if (!success) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
