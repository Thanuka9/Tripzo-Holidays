"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  galleryCategories,
  showcaseGallery,
  type GalleryCategory,
  type ShowcaseImage,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type Item = ShowcaseImage & {
  subtitle?: string;
  /** CSS object-position for awkward crops */
  focus?: string;
};

type Props = {
  uploads?: {
    id: string;
    src: string;
    title: string;
    kind?: string;
    place?: string;
    people?: string;
    caption?: string;
    category?: string;
  }[];
};

/** Prefer subject framing for known landmarks that crop poorly at center-top */
const FOCUS_BY_SRC: Record<string, string> = {
  "/images/gallery/gallery-ella.jpg": "center 65%",
  "/images/gallery/gallery-yala.jpg": "center 40%",
  "/images/gallery/gallery-pinnawala.jpg": "center 35%",
  "/images/gallery/gallery-sigiriya.jpg": "center 35%",
  "/images/gallery/gallery-sigiriya-2.jpg": "center 40%",
  "/images/gallery/gallery-sigiriya-3.jpg": "center 40%",
  "/images/gallery/gallery-sigiriya-4.jpg": "center 35%",
  "/images/gallery/gallery-tooth.jpg": "center 40%",
  "/images/gallery/gallery-tooth-2.jpg": "center 40%",
  "/images/gallery/gallery-tooth-3.jpg": "center 45%",
  "/images/gallery/gallery-tea.jpg": "center 45%",
  "/images/gallery/gallery-tea-2.jpg": "center 35%",
  "/images/gallery/gallery-tea-3.jpg": "center 45%",
  "/images/gallery/gallery-beach.jpg": "center 55%",
  "/images/gallery/gallery-galle.jpg": "center 45%",
  "/images/gallery/gallery-dambulla.jpg": "center 40%",
  "/images/gallery/gallery-kandy.jpg": "center 45%",
  "/images/gallery/udawalawe.jpg": "center 40%",
  "/images/gallery/stilt-fishermen.jpg": "center 60%",
  "/images/gallery/ravana-falls.jpg": "center 40%",
  "/images/gallery/train-hills.jpg": "center 45%",
  "/images/gallery/mist-hills.jpg": "center 40%",
  "/images/gallery/polonnaruwa.jpg": "center 40%",
  "/images/gallery/anuradhapura.jpg": "center 35%",
  "/images/gallery/horton.jpg": "center 45%",
  "/images/gallery/adam-peak.jpg": "center 30%",
  "/images/gallery/whale.jpg": "center 55%",
  "/images/gallery/unawatuna.jpg": "center 55%",
  "/images/gallery/jaffna.jpg": "center 40%",
  "/images/gallery/tea-picker.jpg": "center 35%",
  "/images/gallery/train-window.jpg": "center 45%",
};

function focusFor(src: string) {
  return FOCUS_BY_SRC[src] || "center center";
}

export function GalleryShowcase({ uploads = [] }: Props) {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("filter") as GalleryCategory | "all") || "all";
  const [filter, setFilter] = useState<GalleryCategory | "all">(
    galleryCategories.some((c) => c.id === initial) ? initial : "all",
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const f = searchParams.get("filter");
    if (f && galleryCategories.some((c) => c.id === f)) {
      setFilter(f as GalleryCategory | "all");
    }
  }, [searchParams]);

  const teamCount = uploads.filter((u) => u.kind === "team").length;

  const items = useMemo(() => {
    const categoryIds = new Set(
      galleryCategories.map((c) => c.id).filter((id) => id !== "all"),
    );

    const uploaded: Item[] = uploads.map((u) => {
      const fromMeta =
        (u.category && categoryIds.has(u.category as GalleryCategory)
          ? (u.category as GalleryCategory)
          : null) ||
        (u.place && categoryIds.has(u.place as GalleryCategory)
          ? (u.place as GalleryCategory)
          : null) ||
        (u.caption && categoryIds.has(u.caption as GalleryCategory)
          ? (u.caption as GalleryCategory)
          : null);
      return {
        id: u.id,
        src: u.src,
        title: u.title,
        category:
          u.kind === "team"
            ? ("trips" as GalleryCategory)
            : fromMeta || ("journey" as GalleryCategory),
        span: "normal" as const,
        focus: focusFor(u.src),
        subtitle: [u.place, u.people, u.caption]
          .filter((v) => v && !categoryIds.has(v as GalleryCategory))
          .join(" · "),
      };
    });

    const uploadSrcs = new Set(uploaded.map((u) => u.src));
    const staticExtra: Item[] = showcaseGallery
      .filter((s) => !uploadSrcs.has(s.src))
      .map((s) => ({ ...s, focus: focusFor(s.src) }));
    const merged = [...uploaded, ...staticExtra];
    if (filter === "all") return merged;
    return merged.filter((i) => i.category === filter);
  }, [uploads, filter]);

  const active = activeIndex != null ? items[activeIndex] : null;

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => setActiveIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setActiveIndex((i) => {
        if (i == null || items.length === 0) return i;
        return (i + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeIndex, close, go]);

  // Keep index valid when filter changes
  useEffect(() => {
    setActiveIndex(null);
  }, [filter]);

  return (
    <div>
      {teamCount > 0 && filter !== "trips" && (
        <button
          type="button"
          onClick={() => setFilter("trips")}
          className="mb-6 w-full rounded-2xl border border-lagoon/30 bg-lagoon/10 px-4 py-3 text-left transition hover:bg-lagoon/15"
        >
          <p className="text-sm font-semibold text-jungle">
            {teamCount} new trip photo{teamCount === 1 ? "" : "s"} from the cab team
          </p>
          <p className="text-xs text-muted">
            Tap to view Our trips  -  photos with guests and places on the road.
          </p>
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        {galleryCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              filter === cat.id
                ? "bg-jungle text-foam"
                : "border border-line bg-foam text-muted hover:text-jungle",
            )}
          >
            {cat.label}
            {cat.id === "trips" && teamCount > 0 ? ` (${teamCount})` : ""}
          </button>
        ))}
      </div>

      {filter === "trips" && teamCount === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-line bg-foam p-8 text-center text-sm text-muted">
          No team trip photos yet. When the cab team uploads from Admin → Trip photos, they
          appear here and on the home page.
        </p>
      )}

      <div className="mt-8 grid auto-rows-[200px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[220px]">
        {items.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(index)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-line bg-mist/40 text-left shadow-sm",
              img.span === "wide" && "col-span-2",
              img.span === "tall" && "row-span-2",
            )}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              style={{ objectPosition: img.focus || focusFor(img.src) }}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jungle/85 via-jungle/15 to-transparent opacity-95" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun">
                {img.category === "trips" ? "Our trips" : img.category}
              </p>
              <p className="mt-0.5 font-display text-sm leading-snug text-foam sm:text-base">
                {img.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {active && activeIndex != null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-jungle/90 p-3 backdrop-blur-md sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery slideshow"
        >
          <div
            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.25rem] bg-foam shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <p className="text-xs text-muted sm:text-sm">
                {activeIndex + 1} / {items.length}
                <span className="mx-2 text-line">·</span>
                <span className="capitalize text-lagoon">
                  {active.category === "trips" ? "Our trips" : active.category}
                </span>
              </p>
              <button
                type="button"
                onClick={close}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-jungle hover:bg-mist"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative bg-jungle">
              <div className="relative mx-auto aspect-[16/10] w-full max-h-[70vh]">
                <Image
                  src={active.src}
                  alt={active.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 960px"
                  priority
                />
              </div>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-foam/30 bg-jungle/60 text-foam backdrop-blur hover:bg-jungle/80 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-foam/30 bg-jungle/60 text-foam backdrop-blur hover:bg-jungle/80 sm:right-4"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <h3 className="font-display text-xl text-jungle sm:text-2xl">
                {active.title}
              </h3>
              {active.subtitle && (
                <p className="mt-1 text-sm text-muted">{active.subtitle}</p>
              )}

              {items.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {items.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                        i === activeIndex
                          ? "border-sun"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                      aria-label={`Go to ${img.title}`}
                      aria-current={i === activeIndex}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: focusFor(img.src) }}
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
