import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFleet } from "@/lib/db";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Tripzo Holidays fleet — sedan hybrid, KDH vans, mini coach and luxury coach with real vehicle photos.",
};

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const fleet = await getFleet();

  return (
    <div className="bg-island">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
          Vehicles
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl md:text-5xl">
          Our fleet
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">
          Real Tripzo vehicles — from hybrid sedans to KDH vans and coaches — matched to your
          group size across Sri Lanka.
        </p>

        <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-14">
          {fleet.map((vehicle) => (
            <article
              key={vehicle.id}
              className="overflow-hidden rounded-[1.75rem] border border-line bg-foam shadow-sm"
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[14rem] sm:min-h-[16rem] lg:min-h-[22rem]">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-8">
                  <h2 className="font-display text-2xl text-jungle sm:text-3xl">{vehicle.name}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">
                    {vehicle.capacity} · {vehicle.idealFor}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {vehicle.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {vehicle.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-jungle"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/book?vehicle=${vehicle.id}`}
                    className="mt-6 inline-flex w-fit rounded-full bg-jungle px-5 py-2.5 text-sm font-semibold text-foam hover:bg-leaf"
                  >
                    Book this vehicle
                  </Link>
                </div>
              </div>

              {vehicle.gallery && vehicle.gallery.length > 1 && (
                <div className="border-t border-line bg-mist/30 p-4 sm:p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-lagoon">
                    More photos
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {vehicle.gallery.map((src) => (
                      <div
                        key={src}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl"
                      >
                        <Image
                          src={src}
                          alt={`${vehicle.name} photo`}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
