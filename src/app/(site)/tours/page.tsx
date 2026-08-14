import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTours } from "@/lib/db";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Explore Tripzo Cabs & Tours packages - airport transfers, day trips, and multi-day Sri Lanka itineraries.",
};

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <div className="bg-island">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
          Packages
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl md:text-5xl">
          Tours & transfers
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">
          Choose a ready-made island route or tell us your dates  -  we tailor every journey
          with comfortable vehicles and local know-how.
        </p>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {tours.map((tour) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="group grid overflow-hidden rounded-[1.5rem] border border-line bg-foam shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[1.1fr_1fr]"
            >
              <div className="relative min-h-44 sm:min-h-52">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lagoon">
                  {tour.duration}
                </p>
                <h2 className="mt-2 font-display text-xl text-jungle sm:text-2xl">{tour.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{tour.summary}</p>
                <span className="mt-4 text-sm font-semibold text-leaf">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
