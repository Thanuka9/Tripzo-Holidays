import { SiteImage as Image } from "@/components/SiteImage";
import Link from "next/link";
import type { GalleryImage } from "@/lib/db";

export function TeamTripsSection({ photos }: { photos: GalleryImage[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
              From the cab team
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl text-balance">
              Real trip moments
            </h2>
            <p className="mt-3 text-muted">
              Photos our drivers and guides take with guests and at the places you visit  - 
              uploaded from the Tripzo team.
            </p>
          </div>
          <Link
            href="/gallery?filter=trips"
            className="text-sm font-semibold text-leaf transition hover:text-jungle"
          >
            See all trip photos →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.slice(0, 6).map((photo) => (
            <Link
              key={photo.id}
              href="/gallery?filter=trips"
              className="group relative min-h-[16rem] overflow-hidden rounded-[1.35rem]"
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle/85 via-jungle/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun">
                  Our trips
                </p>
                <h3 className="mt-1 font-display text-xl text-foam">{photo.title}</h3>
                {(photo.place || photo.people) && (
                  <p className="mt-1 text-sm text-foam/75">
                    {[photo.place, photo.people].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
