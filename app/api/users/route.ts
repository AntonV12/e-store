import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchUsers } from "./usersController";

// interface Context {
//   params: undefined;
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    if (isNaN(limit) || limit < 0) {
      return NextResponse.json({ error: "Invalid limit value" }, { status: 400 });
    }

    const data = await fetchUsers(limit);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
