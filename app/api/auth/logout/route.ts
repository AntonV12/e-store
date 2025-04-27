import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/sessions";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Пользователь успешно вышел" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
