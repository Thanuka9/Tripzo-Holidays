import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addFleetGalleryImage,
  deleteFleetVehicle,
  getFleet,
  reorderFleet,
  updateFleetGallery,
  upsertFleetVehicle,
} from "@/lib/db";

async function saveFleetUpload(file: File, vehicleId: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${vehicleId}-${randomUUID().slice(0, 6)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "fleet");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/fleet/${filename}`;
}

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
    return NextResponse.json(
      { error: "Name and description required" },
      { status: 400 },
    );
  }

  const fleet = await getFleet();
  const existing = fleet.find((v) => v.id === id);

  let image = existingImage || existing?.image || "";
  let gallery = existing?.gallery ? [...existing.gallery] : [];

  if (file instanceof File && file.size > 0) {
    try {
      const src = await saveFleetUpload(file, id);
      image = src;
      if (!gallery.includes(src)) gallery = [src, ...gallery];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!image) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  if (!gallery.includes(image)) {
    gallery = [image, ...gallery];
  }

  try {
    const vehicle = await upsertFleetVehicle({
      id,
      name,
      description,
      capacity,
      idealFor,
      image,
      gallery,
      features: featuresRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
    return NextResponse.json({ vehicle });
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

  // JSON: reorder vehicles, reorder gallery, set main, remove gallery image
  if (contentType.includes("application/json")) {
    const body = await req.json();

    if (Array.isArray(body.orderedVehicleIds)) {
      try {
        const fleet = await reorderFleet(body.orderedVehicleIds.map(String));
        return NextResponse.json({ fleet });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Reorder failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing vehicle id" }, { status: 400 });
    }

    if (Array.isArray(body.gallery)) {
      try {
        const vehicle = await updateFleetGallery(
          id,
          body.gallery.map(String),
          body.mainImage ? String(body.mainImage) : undefined,
        );
        if (!vehicle) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ vehicle });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    if (body.removeImage) {
      const fleet = await getFleet();
      const current = fleet.find((v) => v.id === id);
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
        const vehicle = await updateFleetGallery(
          id,
          gallery,
          current.image === removeSrc ? gallery[0] : current.image,
        );
        return NextResponse.json({ vehicle });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Remove failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    if (body.mainImage) {
      const fleet = await getFleet();
      const current = fleet.find((v) => v.id === id);
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const gallery = current.gallery || [current.image];
      try {
        const vehicle = await updateFleetGallery(
          id,
          gallery,
          String(body.mainImage),
        );
        return NextResponse.json({ vehicle });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // FormData: add gallery photo(s) to existing vehicle
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const file = form.get("file");
  if (!id || !(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Vehicle id and file required" },
      { status: 400 },
    );
  }

  try {
    const src = await saveFleetUpload(file, id);
    const vehicle = await addFleetGalleryImage(id, src);
    if (!vehicle) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ vehicle });
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
    const fleet = await deleteFleetVehicle(String(id));
    return NextResponse.json({ fleet });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
