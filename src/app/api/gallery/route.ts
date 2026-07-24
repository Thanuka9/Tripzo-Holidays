import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import { addGalleryImage, deleteGalleryImage, getGallery } from "@/lib/db";

export async function GET() {
  const gallery = await getGallery();
  return NextResponse.json({ gallery });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") || "Untitled");
  const caption = String(form.get("caption") || "");
  const place = String(form.get("place") || "");
  const people = String(form.get("people") || "");
  const kindRaw = String(form.get("kind") || "general");
  const kind = kindRaw === "team" ? "team" : "general";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "gallery");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);

  const image = await addGalleryImage({
    src: `/uploads/gallery/${filename}`,
    title,
    caption: caption || undefined,
    place: place || undefined,
    people: people || undefined,
    kind,
  });

  return NextResponse.json({ image });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const gallery = await deleteGalleryImage(String(id));
  return NextResponse.json({ gallery });
}
