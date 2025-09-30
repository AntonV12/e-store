import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);

    const sql = "UPDATE products SET viewed = viewed + 1 WHERE id = ?";
    await pool.execute(sql, [id]);
    return NextResponse.json({ message: "success" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error", err }, { status: 500 });
  }
}
