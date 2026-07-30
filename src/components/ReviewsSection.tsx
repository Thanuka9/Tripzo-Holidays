"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function ReviewsSection({
  reviews,
  showFormLink = true,
  tone = "dark",
}: {
  reviews: Review[];
  showFormLink?: boolean;
  tone?: "dark" | "light";
}) {
  const slides = reviews.filter((r) => r.comment?.trim());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dark = tone === "dark";

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

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
    <section
      className={cn(
        "relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24",
        dark ? "bg-jungle text-foam" : "bg-island text-jungle",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {dark ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(240,180,41,0.18),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(45,138,120,0.35),transparent_50%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-8 select-none font-display text-[10rem] leading-none text-foam/[0.05] sm:text-[14rem]"
          >
            “
          </div>
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-6 select-none font-display text-[9rem] leading-none text-jungle/[0.05] sm:text-[12rem]"
        >
          “
        </div>
      )}

      <div className="relative mx-auto max-w-3xl text-center">
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.22em]",
            dark ? "text-sun" : "text-lagoon",
          )}
        >
          Google · 4.8 ★ · {slides.length} reviews
        </p>
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-semibold sm:text-4xl md:text-5xl",
            dark ? "text-foam" : "text-jungle",
          )}
        >
          What travelers say
        </h2>
        <p
          className={cn(
            "mx-auto mt-3 max-w-lg text-sm sm:text-base",
            dark ? "text-foam/70" : "text-muted",
          )}
        >
          Real words from guests who rode and toured with Tripzo across Sri Lanka.
        </p>

        {/* Grid stack: height follows the tallest review  -  no overlap */}
        <div className="mt-10 grid sm:mt-12">
          {slides.map((r, i) => {
            const active = i === index;
            const initials = initialsFrom(r.name) || "T";
            return (
              <blockquote
                key={r.id}
                className={cn(
                  "col-start-1 row-start-1 flex flex-col items-center px-1 transition-all duration-500 ease-out",
                  active
                    ? "relative z-10 translate-y-0 opacity-100"
                    : "pointer-events-none z-0 translate-y-2 opacity-0",
                )}
                aria-hidden={!active}
              >
                <div className="mb-5 flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-5 w-5 shrink-0",
                        s < r.rating
                          ? "fill-sun text-sun"
                          : dark
                            ? "text-foam/25"
                            : "text-line",
                      )}
                    />
                  ))}
                </div>

                <p
                  className={cn(
                    "max-w-2xl font-display text-lg font-medium leading-relaxed text-balance sm:text-xl md:text-2xl md:leading-relaxed",
                    dark ? "text-foam" : "text-jungle",
                  )}
                >
                  “{r.comment}”
                </p>

                <footer className="mt-8 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun font-display text-sm font-semibold text-jungle"
                  >
                    {initials}
                  </span>
                  <div className="text-left">
                    <cite
                      className={cn(
                        "block text-sm font-semibold not-italic sm:text-base",
                        dark ? "text-foam" : "text-jungle",
                      )}
                    >
                      {r.name}
                    </cite>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs sm:text-sm",
                        dark ? "text-foam/65" : "text-muted",
                      )}
                    >
                      {[r.country, r.tourTitle].filter(Boolean).join(" · ") ||
                        "Tripzo guest"}
                    </span>
                  </div>
                </footer>
              </blockquote>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border transition",
              dark
                ? "border-foam/25 text-foam hover:border-sun hover:bg-sun/10"
                : "border-line text-jungle hover:bg-mist",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex max-w-[12rem] flex-wrap justify-center gap-1.5 sm:max-w-none">
            {slides.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review by ${r.name}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-7 bg-sun"
                    : dark
                      ? "w-2 bg-foam/30 hover:bg-foam/55"
                      : "w-2 bg-line hover:bg-muted/40",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border transition",
              dark
                ? "border-foam/25 text-foam hover:border-sun hover:bg-sun/10"
                : "border-line text-jungle hover:bg-mist",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12">
          <a
            href={SITE.googleMapsReviews}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition",
              dark
                ? "border-foam/30 text-foam hover:border-sun hover:text-sun"
                : "border-line text-jungle hover:border-lagoon hover:text-lagoon",
            )}
          >
            See on Google
          </a>
          {showFormLink && (
            <Link
              href="/reviews"
              className="inline-flex min-h-11 items-center rounded-full bg-sun px-5 py-2.5 text-sm font-bold text-jungle transition hover:bg-gold"
            >
              Write a review
            </Link>
          )}
        </div>
      </div>

      <p className="sr-only">
        {current.name}: {current.comment}
      </p>
    </section>
  );
}
