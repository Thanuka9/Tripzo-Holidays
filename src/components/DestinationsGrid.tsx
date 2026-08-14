"use client";

import { SiteImage as Image } from "@/components/SiteImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Destination } from "@/lib/destinations";

type Props = {
  destinations: Destination[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
};

function PlaceCard({
  place,
  featured,
}: {
  place: Destination;
  featured?: boolean;
}) {
  const slides =
    place.gallery && place.gallery.length > 0
      ? place.gallery
      : [place.image];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.35rem] ${
        featured
          ? "col-span-1 min-h-[18rem] sm:col-span-2 sm:min-h-[22rem] lg:col-span-2 lg:row-span-2"
          : "min-h-[14rem] sm:min-h-[16rem]"
      }`}
    >
      {slides.map((src, i) => (
        <Image
          key={`${place.id}-${src}-${i}`}
          src={src}
          alt={place.name}
          fill
          className={`object-cover transition duration-1000 ${
            i === index
              ? "scale-100 opacity-100"
              : "scale-105 opacity-0"
          } group-hover:scale-105`}
          style={{ objectPosition: "center 42%" }}
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority={featured && i === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-jungle/85 via-jungle/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun sm:text-xs">
          {place.region}
        </p>
        <h3 className="mt-1 font-display text-xl text-foam sm:text-2xl">
          {place.name}
        </h3>
        <p className="mt-2 max-w-md text-sm text-foam/80 line-clamp-2">
          {place.description}
        </p>
        {slides.length > 1 && (
          <div className="mt-3 flex gap-1.5">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show photo ${i + 1} of ${place.name}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === index ? "w-6 bg-sun" : "w-2 bg-foam/40 hover:bg-foam/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function DestinationsGrid({
  destinations,
  title = "Places we take you",
  subtitle = "Signature stops across Sri Lanka  -  heritage, highlands, wildlife, and coast.",
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
            <h2 className="mt-3 font-display text-3xl font-semibold text-jungle text-balance sm:text-4xl">
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
            <PlaceCard key={place.id} place={place} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
