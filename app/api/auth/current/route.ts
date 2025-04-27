import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/api/auth/authController";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(null);
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
