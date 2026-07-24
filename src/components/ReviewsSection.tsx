"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ReviewsSection({
  reviews,
  showFormLink = true,
}: {
  reviews: Review[];
  showFormLink?: boolean;
}) {
  const slides = reviews.filter((r) => r.comment?.trim());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="bg-island px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
            Reviews
          </p>
          <h2 className="mt-3 font-display text-3xl text-jungle sm:text-4xl">
            Be the first to leave feedback
          </h2>
          {showFormLink && (
            <Link
              href="/reviews"
              className="mt-6 inline-flex rounded-full bg-jungle px-5 py-3 text-sm font-semibold text-foam"
            >
              Write a review
            </Link>
          )}
        </div>
      </section>
    );
  }

  const current = slides[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <section className="bg-island px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
              Google · 4.8 ★
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl">
              What travelers say
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.googleMapsReviews}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-lagoon hover:text-jungle"
            >
              See on Google →
            </a>
            {showFormLink && (
              <Link href="/reviews" className="text-sm font-semibold text-leaf">
                Write a review →
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-line bg-foam px-4 py-8 sm:px-10 sm:py-10">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-jungle transition hover:bg-mist"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative min-h-[7.5rem] flex-1 overflow-hidden text-center sm:min-h-[6rem]">
              {slides.map((r, i) => (
                <blockquote
                  key={r.id}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500",
                    i === index
                      ? "translate-y-0 opacity-100"
                      : i < index
                        ? "-translate-y-3 opacity-0"
                        : "translate-y-3 opacity-0",
                  )}
                  aria-hidden={i !== index}
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s < r.rating ? "fill-sun text-sun" : "text-line",
                        )}
                      />
                    ))}
                  </div>
                  <p className="line-clamp-2 max-w-3xl text-base leading-snug text-jungle sm:line-clamp-1 sm:text-lg sm:leading-relaxed">
                    “{r.comment}”
                  </p>
                  <footer className="mt-3 text-sm text-muted">
                    <span className="font-semibold text-jungle">{r.name}</span>
                    {(r.country || r.tourTitle) && (
                      <span>
                        {" "}
                        · {[r.country, r.tourTitle].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </footer>
                </blockquote>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-jungle transition hover:bg-mist"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {slides.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review by ${r.name}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-7 bg-lagoon" : "w-2.5 bg-line hover:bg-muted/40",
                )}
              />
            ))}
          </div>
        </div>

        {/* Keep current in DOM for screen readers when animating */}
        <p className="sr-only">
          {current.name}: {current.comment}
        </p>
      </div>
    </section>
  );
}
