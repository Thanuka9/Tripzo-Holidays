import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/BookingForm";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book a Journey",
  description: "Request a cab, transfer, or multi-day Sri Lanka tour with Tripzo.",
};

export default function BookPage() {
  return (
    <div className="bg-island">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
            Reservations
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-jungle sm:text-5xl text-balance">
            Book your unforgettable journey
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Submit a request online and we will confirm availability. Prefer chatting? Reach
            us instantly on WhatsApp at {SITE.phoneDisplay}.
          </p>
          <a
            href={whatsappLink("Hi Tripzo! I'd like to book a vehicle or tour.")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
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
