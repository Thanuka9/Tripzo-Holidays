import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addDestinationGalleryImages,
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
  const rawId = String(form.get("id") || "").trim();
  const name = String(form.get("name") || "").trim();
  const id =
    rawId.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/^-|-$/g, "") ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 72) ||
    randomUUID().slice(0, 8);
  const region = String(form.get("region") || "");
  const description = String(form.get("description") || "");
  const featured =
    form.get("featured") === "on" || form.get("featured") === "true";
  const slideshow =
    form.get("slideshow") === "on" || form.get("slideshow") === "true";
  const existingImage = String(form.get("existingImage") || "");
  const files = [
    ...form.getAll("file"),
    ...form.getAll("files"),
  ].filter((f): f is File => f instanceof File && f.size > 0);

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

  if (files.length > 0) {
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await saveUpload(file, id));
      }
      image = uploaded[0] || image;
      gallery = [...uploaded, ...gallery.filter((src) => !uploaded.includes(src))];
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

    if (body.name || body.region || body.description || body.featured != null || body.slideshow != null) {
      const list = await getDestinations();
      const current = list.find((d) => d.id === id);
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      try {
        const destination = await upsertDestination({
          ...current,
          name: body.name != null ? String(body.name) : current.name,
          region: body.region != null ? String(body.region) : current.region,
          description:
            body.description != null
              ? String(body.description)
              : current.description,
          featured:
            body.featured != null ? Boolean(body.featured) : current.featured,
          slideshow:
            body.slideshow != null ? Boolean(body.slideshow) : current.slideshow,
          image: current.image,
          gallery: current.gallery,
        });
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
  const files = [
    ...form.getAll("file"),
    ...form.getAll("files"),
  ].filter((f): f is File => f instanceof File && f.size > 0);
  if (!id || files.length === 0) {
    return NextResponse.json(
      { error: "Destination id and at least one photo required" },
      { status: 400 },
    );
  }

  try {
    const srcs: string[] = [];
    for (const file of files) {
      srcs.push(await saveUpload(file, id));
    }
    const destination = await addDestinationGalleryImages(id, srcs);
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
