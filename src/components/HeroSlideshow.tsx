"use client";

import { SiteImage as Image } from "@/components/SiteImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { slideshowSlides } from "@/lib/destinations";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  src: string;
  title: string;
  caption: string;
};

export function HeroSlideshow({
  slides = slideshowSlides,
}: {
  slides?: HeroSlide[];
}) {
  const items = slides.length > 0 ? slides : slideshowSlides;
  const [index, setIndex] = useState(0);
  const slide = items[index % items.length];

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [items.length]);

  function go(delta: number) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-jungle sm:min-h-[92vh]">
      {items.map((item, i) => (
        <div
          key={`${item.src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-jungle/90 via-jungle/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-jungle/80 via-transparent to-jungle/50" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-end px-4 pb-24 pt-[calc(var(--site-header-height)+2.5rem)] sm:min-h-[92vh] sm:px-6 sm:pb-20 sm:pt-[calc(var(--site-header-height)+3rem)]">
        <p className="text-xs uppercase tracking-[0.28em] text-foam/80 sm:text-sm">
          Sri Lanka · Tours & Transport
        </p>
        <p className="mt-3 font-display text-2xl font-medium tracking-tight text-sun sm:mt-4 sm:text-3xl md:text-4xl">
          Tripzo Holidays
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-[1.75rem] font-medium leading-tight text-foam text-balance sm:mt-4 sm:text-4xl md:text-5xl">
          Every journey, smooth and unforgettable
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-foam/85 sm:mt-4 sm:text-lg">
          {SITE.tagline} From daily rides to dream tours across the island.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-bold text-jungle transition hover:bg-gold sm:px-6"
          >
            Book your journey
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tours/seven-days-sri-lanka"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foam/40 bg-foam/10 px-5 py-3 text-sm font-semibold text-foam backdrop-blur transition hover:bg-foam/20 sm:px-6"
          >
            Explore 7-day route
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 sm:mt-10">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-sun/90">Now showing</p>
            <p className="font-display text-lg text-foam sm:text-2xl">{slide.title}</p>
            <p className="text-xs text-foam/75 sm:text-sm">{slide.caption}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-foam/30 bg-foam/10 text-foam backdrop-blur hover:bg-foam/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-foam/30 bg-foam/10 text-foam backdrop-blur hover:bg-foam/20"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {items.map((item, i) => (
            <button
              key={`${item.src}-dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.title}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-sun" : "w-3 bg-foam/40 hover:bg-foam/70",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
