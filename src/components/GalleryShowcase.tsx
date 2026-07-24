"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  galleryCategories,
  showcaseGallery,
  type GalleryCategory,
  type ShowcaseImage,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type Item = ShowcaseImage & { subtitle?: string };

type Props = {
  uploads?: {
    id: string;
    src: string;
    title: string;
    kind?: string;
    place?: string;
    people?: string;
    caption?: string;
  }[];
};

export function GalleryShowcase({ uploads = [] }: Props) {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("filter") as GalleryCategory | "all") || "all";
  const [filter, setFilter] = useState<GalleryCategory | "all">(
    galleryCategories.some((c) => c.id === initial) ? initial : "all",
  );
  const [active, setActive] = useState<Item | null>(null);

  useEffect(() => {
    const f = searchParams.get("filter");
    if (f && galleryCategories.some((c) => c.id === f)) {
      setFilter(f as GalleryCategory | "all");
    }
  }, [searchParams]);

  const teamCount = uploads.filter((u) => u.kind === "team").length;

  const items = useMemo(() => {
    const uploaded: Item[] = uploads.map((u) => ({
      id: u.id,
      src: u.src,
      title: u.title,
      category: (u.kind === "team" ? "trips" : "journey") as GalleryCategory,
      span: "normal" as const,
      subtitle: [u.place, u.people, u.caption].filter(Boolean).join(" · "),
    }));
    const merged = [...uploaded, ...showcaseGallery];
    if (filter === "all") return merged;
    return merged.filter((i) => i.category === filter);
  }, [uploads, filter]);

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
            Tap to view Our trips — photos with guests and places on the road.
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

      <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {items.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(img)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-line bg-foam text-left shadow-sm",
              img.span === "wide" && "col-span-2",
              img.span === "tall" && "row-span-2",
            )}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jungle/80 via-transparent to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun">
                {img.category === "trips" ? "Our trips" : img.category}
              </p>
              <p className="font-display text-sm text-foam sm:text-base">{img.title}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-jungle/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-foam"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-jungle/80 text-foam"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full">
              <Image src={active.src} alt={active.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-lagoon">
                {active.category === "trips" ? "Our trips" : active.category}
              </p>
              <h3 className="mt-1 font-display text-2xl text-jungle">{active.title}</h3>
              {active.subtitle && (
                <p className="mt-2 text-sm text-muted">{active.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
