import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTourBySlug, getTours } from "@/lib/db";
import { BookingForm } from "@/components/BookingForm";
import { whatsappLink } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour" };
  return { title: tour.title, description: tour.summary };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const [tour, tours] = await Promise.all([getTourBySlug(slug), getTours()]);
  if (!tour) notFound();

  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden">
        <Image src={tour.image} alt={tour.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/50 to-jungle/45" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-[var(--site-header-height)] sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sun">
            {tour.duration}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold text-foam sm:text-5xl text-balance">
            {tour.title}
          </h1>
          <p className="mt-3 max-w-2xl text-foam/85">{tour.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl text-jungle">Overview</h2>
          <p className="mt-4 leading-relaxed text-muted">{tour.summary}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {tour.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full border border-line bg-mist px-3 py-1.5 text-xs font-medium text-jungle"
              >
                {h}
              </span>
            ))}
          </div>

          {tour.pdfUrl && (
            <a
              href={tour.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-lagoon/40 bg-lagoon/10 px-5 py-2.5 text-sm font-semibold text-jungle transition hover:bg-lagoon/20"
            >
              Download full itinerary PDF
            </a>
          )}

          {slug === "seven-days-sri-lanka" && (
            <div className="mt-12">
              <h2 className="font-display text-3xl text-jungle">Premium 7-Day Route Map</h2>
              <p className="mt-2 text-sm text-muted">
                Airport → Sigiriya → Kandy → Nuwara Eliya → Ella → Yala & the south coast  - 
                and back.
              </p>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-line bg-mist/40 p-3 sm:p-5">
                <Image
                  src="/images/route-map-v2.png"
                  alt="Tripzo Holidays Premium 7-Day Sri Lanka Route Map"
                  width={912}
                  height={498}
                  priority
                  className="h-auto w-full object-contain bg-foam"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
            </div>
          )}

          {tour.itinerary && (
            <div className="mt-12">
              <h2 className="font-display text-3xl text-jungle">
                {tour.slug === "seven-days-sri-lanka"
                  ? "How the 7-Day Route is Crafted"
                  : "Day-by-day route"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {tour.slug === "seven-days-sri-lanka"
                  ? "Your complete Seven Days Sri Lanka Tour Package  -  paced for comfort, scenery, and signature stops."
                  : "How this journey is crafted  -  paced for comfort, scenery, and signature stops."}
              </p>
              <ol className="mt-8 space-y-5">
                {tour.itinerary.map((day) => (
                  <li
                    key={day.day}
                    className="relative rounded-3xl border border-line bg-foam p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="rounded-full bg-jungle px-3 py-1 text-xs font-bold text-sun">
                        Day {String(day.day).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl text-jungle">{day.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {day.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {day.highlights.map((h) => (
                        <span key={h} className="text-xs font-medium text-lagoon">
                          · {h}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-mist" />}>
            <BookingForm defaultTour={tour.slug} compact tours={tours} />
          </Suspense>
          <a
            href={whatsappLink(
              `Hi Tripzo! I'm interested in the ${tour.title} package.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
          >
            WhatsApp about this tour
          </a>
          <Link
            href="/tours"
            className="mt-3 block text-center text-sm font-medium text-muted hover:text-jungle"
          >
            ← Back to all tours
          </Link>
        </aside>
      </section>
    </div>
  );
}
