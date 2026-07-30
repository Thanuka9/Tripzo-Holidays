import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addGalleryImage,
  deleteGalleryImage,
  ensureDefaultHeroSlides,
  ensureShowcaseGallery,
  getGallery,
  reorderGallery,
  setGalleryMain,
  updateGalleryImage,
  type GalleryKind,
} from "@/lib/db";

async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "gallery");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/gallery/${filename}`;
}

export async function GET() {
  await ensureDefaultHeroSlides();
  await ensureShowcaseGallery();
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
  const kind: GalleryKind =
    kindRaw === "team" ? "team" : kindRaw === "hero" ? "hero" : "general";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  try {
    const src = await saveUpload(file);
    const image = await addGalleryImage({
      src,
      title,
      caption: caption || undefined,
      place: place || undefined,
      people: people || undefined,
      kind,
    });
    return NextResponse.json({ image });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed  -  storage may be read-only.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  // Reorder: JSON { orderedIds: string[] }
  // Update meta / replace file: FormData with id + optional fields/file
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (Array.isArray(body.orderedIds)) {
      try {
        const gallery = await reorderGallery(body.orderedIds.map(String));
        return NextResponse.json({ gallery });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Reorder failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (body.setMain) {
      try {
        const gallery = await setGalleryMain(id);
        if (!gallery) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ gallery });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    try {
      const image = await updateGalleryImage(id, {
        title: body.title != null ? String(body.title) : undefined,
        caption: body.caption != null ? String(body.caption) : undefined,
        place: body.place != null ? String(body.place) : undefined,
        people: body.people != null ? String(body.people) : undefined,
        kind: body.kind,
        featured: body.featured != null ? Boolean(body.featured) : undefined,
      });
      if (!image) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ image });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const patch: Parameters<typeof updateGalleryImage>[1] = {};
  if (form.has("title")) patch.title = String(form.get("title") || "");
  if (form.has("caption")) patch.caption = String(form.get("caption") || "");
  if (form.has("place")) patch.place = String(form.get("place") || "");
  if (form.has("people")) patch.people = String(form.get("people") || "");
  if (form.has("kind")) {
    const kindRaw = String(form.get("kind") || "general");
    patch.kind =
      kindRaw === "team" ? "team" : kindRaw === "hero" ? "hero" : "general";
  }

  const file = form.get("file");
  try {
    if (file instanceof File && file.size > 0) {
      patch.src = await saveUpload(file);
    }
    const image = await updateGalleryImage(id, patch);
    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ image });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  try {
    const gallery = await deleteGalleryImage(String(id));
    return NextResponse.json({ gallery });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
