import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/destinations";

type Props = {
  destinations: Destination[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
};

export function DestinationsGrid({
  destinations,
  title = "Places we take you",
  subtitle = "Signature stops across Sri Lanka — heritage, highlands, wildlife, and coast.",
  showAllLink = true,
}: Props) {
  return (
    <section className="bg-island px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
              Destinations
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl text-balance">
              {title}
            </h2>
            <p className="mt-3 text-muted">{subtitle}</p>
          </div>
          {showAllLink && (
            <Link href="/destinations" className="text-sm font-semibold text-leaf">
              View all places →
            </Link>
          )}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((place, i) => (
            <article
              key={place.id}
              className={`group relative overflow-hidden rounded-[1.35rem] ${
                i === 0
                  ? "col-span-1 min-h-[18rem] sm:col-span-2 sm:min-h-[22rem] lg:col-span-2 lg:row-span-2"
                  : "min-h-[14rem] sm:min-h-[16rem]"
              }`}
            >
              <Image
                src={place.image}
                alt={place.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle/85 via-jungle/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun sm:text-xs">
                  {place.region}
                </p>
                <h3 className="mt-1 font-display text-xl text-foam sm:text-2xl">{place.name}</h3>
                <p className="mt-2 max-w-md text-sm text-foam/80 line-clamp-2">
                  {place.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
