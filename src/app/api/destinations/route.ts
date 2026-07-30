import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addDestinationGalleryImage,
  deleteDestination,
  getDestinations,
  updateDestinationGallery,
  upsertDestination,
} from "@/lib/db";

async function saveUpload(file: File, destinationId: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${destinationId}-${randomUUID().slice(0, 6)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "destinations");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/destinations/${filename}`;
}

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
  const featured =
    form.get("featured") === "on" || form.get("featured") === "true";
  const slideshow =
    form.get("slideshow") === "on" || form.get("slideshow") === "true";
  const existingImage = String(form.get("existingImage") || "");
  const file = form.get("file");

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description required" },
      { status: 400 },
    );
  }

  const list = await getDestinations();
  const existing = list.find((d) => d.id === id);

  let image = existingImage || existing?.image || "";
  let gallery = existing?.gallery ? [...existing.gallery] : [];

  if (file instanceof File && file.size > 0) {
    try {
      const src = await saveUpload(file, id);
      image = src;
      if (!gallery.includes(src)) gallery = [src, ...gallery];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!image) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }
  if (!gallery.includes(image)) gallery = [image, ...gallery];

  try {
    const destination = await upsertDestination({
      id,
      name,
      region,
      description,
      image,
      gallery,
      featured,
      slideshow,
    });
    return NextResponse.json({ destination });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (Array.isArray(body.gallery)) {
      try {
        const destination = await updateDestinationGallery(
          id,
          body.gallery.map(String),
          body.mainImage ? String(body.mainImage) : undefined,
        );
        if (!destination) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ destination });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    if (body.removeImage) {
      const list = await getDestinations();
      const current = list.find((d) => d.id === id);
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const removeSrc = String(body.removeImage);
      const gallery = (current.gallery || [current.image]).filter(
        (src) => src !== removeSrc,
      );
      if (gallery.length === 0) {
        return NextResponse.json(
          { error: "Keep at least one photo" },
          { status: 400 },
        );
      }
      try {
        const destination = await updateDestinationGallery(
          id,
          gallery,
          current.image === removeSrc ? gallery[0] : current.image,
        );
        return NextResponse.json({ destination });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Remove failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    if (body.mainImage) {
      const list = await getDestinations();
      const current = list.find((d) => d.id === id);
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      try {
        const destination = await updateDestinationGallery(
          id,
          current.gallery || [current.image],
          String(body.mainImage),
        );
        return NextResponse.json({ destination });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const file = form.get("file");
  if (!id || !(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Destination id and file required" },
      { status: 400 },
    );
  }

  try {
    const src = await saveUpload(file, id);
    const destination = await addDestinationGalleryImage(id, src);
    if (!destination) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ destination });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  try {
    const destinations = await deleteDestination(String(id));
    return NextResponse.json({ destinations });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
