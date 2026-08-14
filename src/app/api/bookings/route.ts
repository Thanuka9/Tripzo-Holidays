import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/lib/db";
import { getTourBySlug } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  tourSlug: z.string().optional(),
  vehicleId: z.string().optional(),
  startDate: z.string().min(4),
  travelers: z.number().int().min(1).max(60),
  pickup: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form fields and try again." },
        { status: 400 },
      );
    }

    const tour = parsed.data.tourSlug
      ? await getTourBySlug(parsed.data.tourSlug)
      : undefined;
    const booking = await createBooking({
      ...parsed.data,
      tourTitle: tour?.title,
    });

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Unable to save booking." }, { status: 500 });
  }
}
