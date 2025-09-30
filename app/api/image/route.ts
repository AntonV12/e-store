import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const pathname = searchParams.get("path") || "";

  if (!name) {
    return new Response("Не указано имя файла", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", pathname, name);

  if (!fs.existsSync(filePath)) {
    return new Response("Файл не найден", { status: 404 });
  }

  const ext = path.extname(name).toLowerCase();

  const contentType =
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    }[ext] || "application/octet-stream";

  const fileBuffer = fs.readFileSync(filePath);

  return new Response(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": contentType,
    },
  });
}
