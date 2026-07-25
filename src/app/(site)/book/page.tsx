import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/BookingForm";
import { whatsappLink } from "@/lib/constants";
import { getContactSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Book a Journey",
  description: "Request a cab, transfer, or multi-day Sri Lanka tour with Tripzo.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const contact = await getContactSettings();

  return (
    <div className="bg-island">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
            Reservations
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-jungle text-balance sm:text-4xl md:text-5xl">
            Book your unforgettable journey
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Submit a request online and we will confirm availability. Prefer chatting? Reach
            us instantly on WhatsApp at {contact.phoneDisplay}.
          </p>
          <a
            href={whatsappLink(
              "Hi Tripzo! I'd like to book a vehicle or tour.",
              contact.whatsapp,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
          >
            Message on WhatsApp
          </a>
        </div>
        <Suspense fallback={<div className="h-[32rem] animate-pulse rounded-3xl bg-mist" />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
