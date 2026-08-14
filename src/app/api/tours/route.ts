import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteTour, getTours, getTourBySlug, upsertTour } from "@/lib/db";
import type { Tour, TourDay } from "@/lib/tours";

async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = `tour-${randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "tours");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/tours/${filename}`;
}

function parseHighlights(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseItinerary(raw: string): TourDay[] | undefined {
  const text = raw.trim();
  if (!text) return undefined;
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return undefined;
    return parsed
      .map((day, i) => ({
        day: Number(day.day || i + 1),
        title: String(day.title || `Day ${i + 1}`),
        description: String(day.description || ""),
        highlights: Array.isArray(day.highlights)
          ? day.highlights.map(String)
          : parseHighlights(String(day.highlights || "")),
      }))
      .filter((d) => d.title);
  } catch {
    return undefined;
  }
}

export async function GET() {
  const tours = await getTours();
  return NextResponse.json({ tours });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const slugRaw = String(form.get("slug") || "").trim();
  const slug =
    slugRaw.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/^-|-$/g, "") ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 72);

  if (!title || !slug) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const existing = await getTourBySlug(slug);
  const file = form.get("file");
  let image = String(form.get("existingImage") || existing?.image || "");
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUpload(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  if (!image) {
    return NextResponse.json({ error: "Cover photo is required" }, { status: 400 });
  }

  const categoryRaw = String(form.get("category") || "tour");
  const category: Tour["category"] =
    categoryRaw === "day" || categoryRaw === "transfer" ? categoryRaw : "tour";

  const tour: Tour = {
    slug,
    title,
    subtitle: String(form.get("subtitle") || ""),
    duration: String(form.get("duration") || ""),
    days: Number(form.get("days") || 1) || 1,
    priceFrom: String(form.get("priceFrom") || "") || undefined,
    category,
    image,
    summary: String(form.get("summary") || ""),
    highlights: parseHighlights(String(form.get("highlights") || "")),
    itinerary: parseItinerary(String(form.get("itinerary") || "")),
    featured:
      form.get("featured") === "on" || form.get("featured") === "true",
    pdfUrl: String(form.get("pdfUrl") || "") || undefined,
  };

  try {
    const saved = await upsertTour(tour);
    return NextResponse.json({ tour: saved });
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
    const slug = String(body.slug || "");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const current = await getTourBySlug(slug);
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    try {
      const tour = await upsertTour({
        ...current,
        title: body.title != null ? String(body.title) : current.title,
        subtitle: body.subtitle != null ? String(body.subtitle) : current.subtitle,
        duration: body.duration != null ? String(body.duration) : current.duration,
        days: body.days != null ? Number(body.days) || current.days : current.days,
        priceFrom:
          body.priceFrom != null ? String(body.priceFrom) || undefined : current.priceFrom,
        category:
          body.category === "day" || body.category === "transfer" || body.category === "tour"
            ? body.category
            : current.category,
        summary: body.summary != null ? String(body.summary) : current.summary,
        highlights: Array.isArray(body.highlights)
          ? body.highlights.map(String)
          : current.highlights,
        itinerary: Array.isArray(body.itinerary)
          ? body.itinerary
          : current.itinerary,
        featured: body.featured != null ? Boolean(body.featured) : current.featured,
        pdfUrl: body.pdfUrl != null ? String(body.pdfUrl) || undefined : current.pdfUrl,
        image: body.image != null ? String(body.image) : current.image,
      });
      return NextResponse.json({ tour });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const form = await req.formData();
  const slug = String(form.get("slug") || "");
  const file = form.get("file");
  const current = await getTourBySlug(slug);
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }
  try {
    const image = await saveUpload(file);
    const tour = await upsertTour({ ...current, image });
    return NextResponse.json({ tour });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await req.json();
  try {
    const tours = await deleteTour(String(slug));
    return NextResponse.json({ tours });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
