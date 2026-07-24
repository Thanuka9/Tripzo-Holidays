import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import { getFleet, upsertFleetVehicle, deleteFleetVehicle } from "@/lib/db";

export async function GET() {
  const fleet = await getFleet();
  return NextResponse.json({ fleet });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const id = String(form.get("id") || randomUUID().slice(0, 8));
  const name = String(form.get("name") || "");
  const description = String(form.get("description") || "");
  const capacity = String(form.get("capacity") || "");
  const idealFor = String(form.get("idealFor") || "");
  const featuresRaw = String(form.get("features") || "");
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
    const dir = path.join(process.cwd(), "public", "uploads", "fleet");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), bytes);
    image = `/uploads/fleet/${filename}`;
  }

  if (!image) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const vehicle = await upsertFleetVehicle({
    id,
    name,
    description,
    capacity,
    idealFor,
    image,
    features: featuresRaw
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
  });

  return NextResponse.json({ vehicle });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const fleet = await deleteFleetVehicle(String(id));
  return NextResponse.json({ fleet });
}
