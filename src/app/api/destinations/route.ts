import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteDestination,
  getDestinations,
  upsertDestination,
} from "@/lib/db";

export async function GET() {
  const destinations = await getDestinations();
  return NextResponse.json({ destinations });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const id = String(form.get("id") || randomUUID().slice(0, 8));
  const name = String(form.get("name") || "");
  const region = String(form.get("region") || "");
  const description = String(form.get("description") || "");
  const featured = form.get("featured") === "on" || form.get("featured") === "true";
  const slideshow = form.get("slideshow") === "on" || form.get("slideshow") === "true";
  const existingImage = String(form.get("existingImage") || "");
  const file = form.get("file");

  if (!name || !description) {
    return NextResponse.json({ error: "Name and description required" }, { status: 400 });
  }

  let image = existingImage;
  if (file instanceof File && file.size > 0) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${id}-${randomUUID().slice(0, 6)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "destinations");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), bytes);
    image = `/uploads/destinations/${filename}`;
  }

  if (!image) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const destination = await upsertDestination({
    id,
    name,
    region,
    description,
    image,
    featured,
    slideshow,
  });

  return NextResponse.json({ destination });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const destinations = await deleteDestination(String(id));
  return NextResponse.json({ destinations });
}
