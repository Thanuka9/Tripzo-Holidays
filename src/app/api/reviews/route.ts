import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createReview,
  deleteReview,
  getApprovedReviews,
  getReviews,
  updateReviewStatus,
  type ReviewStatus,
} from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  country: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  tourTitle: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ reviews: await getReviews() });
  }
  return NextResponse.json({ reviews: await getApprovedReviews() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse({
      ...body,
      rating: Number(body.rating),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill name, rating, and a short comment." },
        { status: 400 },
      );
    }
    const review = await createReview(parsed.data);
    return NextResponse.json({
      review,
      message: "Thanks! Your review will appear after approval.",
    });
  } catch {
    return NextResponse.json({ error: "Unable to save review." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const id = String(body.id || "");
  const status = body.status as ReviewStatus;
  if (!id || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const review = await updateReviewStatus(id, status);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const reviews = await deleteReview(String(id));
  return NextResponse.json({ reviews });
}
