"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  galleryCategories,
  showcaseAlbums,
  type ShowcaseAlbum,
  type GalleryCategory,
  type ShowcasePhoto,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type AlbumView = ShowcaseAlbum & {
  /** CSS object-position for cover */
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
  "/images/gallery/gallery-tea-2.jpg": "center 40%",
  "/images/gallery/gallery-tea-3.jpg": "center 45%",
  "/images/gallery/nuwara-gregory.jpg": "center 45%",
  "/images/gallery/nuwara-tea-hills.jpg": "center 40%",
  "/images/gallery/nuwara-post-office.jpg": "center 40%",
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
  "/images/gallery/tea-picker.jpg": "center 40%",
  "/images/gallery/train-window.jpg": "center 45%",
};

function focusFor(src: string) {
  return FOCUS_BY_SRC[src] || "center center";
}

function slugifyPlace(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function GalleryShowcase({ uploads = [] }: Props) {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("filter") as GalleryCategory | "all") || "all";
  const [filter, setFilter] = useState<GalleryCategory | "all">(
    galleryCategories.some((c) => c.id === initial) ? initial : "all",
  );
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const f = searchParams.get("filter");
    if (f && galleryCategories.some((c) => c.id === f)) {
      setFilter(f as GalleryCategory | "all");
    }
  }, [searchParams]);

  const teamCount = uploads.filter((u) => u.kind === "team").length;

  const albums = useMemo(() => {
    const categoryIds = new Set(
      galleryCategories.map((c) => c.id).filter((id) => id !== "all"),
    );

    const teamUploads = uploads.filter((u) => u.kind === "team");
    const generalUploads = uploads.filter((u) => u.kind !== "team");

    const tripGroups = new Map<string, AlbumView>();
    for (const u of teamUploads) {
      const place = (u.place || "").trim();
      const key = place ? `trip-${slugifyPlace(place)}` : "album-trips";
      const title = place || "Our trips";
      const existing = tripGroups.get(key);
      const photo: ShowcasePhoto = {
        id: u.id,
        src: u.src,
        title: u.title,
      };
      if (existing) {
        existing.photos.push(photo);
      } else {
        tripGroups.set(key, {
          id: key,
          title,
          category: "trips",
          cover: u.src,
          photos: [photo],
          focus: focusFor(u.src),
        });
      }
    }

    const placeGroups = new Map<string, AlbumView>();
    for (const u of generalUploads) {
      const place = (u.place || u.title || "More photos").trim();
      const key = `album-${slugifyPlace(place) || u.id}`;
      const fromMeta =
        (u.category && categoryIds.has(u.category as GalleryCategory)
          ? (u.category as GalleryCategory)
          : null) || ("journey" as GalleryCategory);
      const photo: ShowcasePhoto = { id: u.id, src: u.src, title: u.title };
      const existing = placeGroups.get(key);
      if (existing) {
        existing.photos.push(photo);
      } else {
        placeGroups.set(key, {
          id: key,
          title: place,
          category: fromMeta,
          cover: u.src,
          photos: [photo],
          focus: focusFor(u.src),
        });
      }
    }

    const fromUploads = [
      ...Array.from(tripGroups.values()),
      ...Array.from(placeGroups.values()),
    ];

    const merged =
      fromUploads.length > 0
        ? fromUploads
        : showcaseAlbums.map((album) => ({
            ...album,
            photos: [...album.photos],
            focus: focusFor(album.cover || album.photos[0]?.src || ""),
          }));

    if (filter === "all") return merged;
    return merged.filter((a) => a.category === filter);
  }, [uploads, filter]);

  const openAlbum = openAlbumId
    ? albums.find((a) => a.id === openAlbumId) || null
    : null;
  const activePhoto =
    openAlbum && openAlbum.photos.length > 0
      ? openAlbum.photos[
          ((photoIndex % openAlbum.photos.length) + openAlbum.photos.length) %
            openAlbum.photos.length
        ]
      : null;

  const openAt = useCallback((albumId: string, index = 0) => {
    setOpenAlbumId(albumId);
    setPhotoIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenAlbumId(null);
    setPhotoIndex(0);
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (!openAlbum || openAlbum.photos.length === 0) return;
      setPhotoIndex(
        (i) => (i + delta + openAlbum.photos.length) % openAlbum.photos.length,
      );
    },
    [openAlbum],
  );

  useEffect(() => {
    if (!openAlbum) return;
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
  }, [openAlbum, close, go]);

  useEffect(() => {
    setOpenAlbumId(null);
    setPhotoIndex(0);
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
        {albums.map((album) => {
          const coverSrc = album.cover || album.photos[0]?.src;
          if (!coverSrc) return null;
          const count = album.photos.length;
          return (
            <button
              key={album.id}
              type="button"
              onClick={() => openAt(album.id, 0)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-line bg-mist/40 text-left shadow-sm",
                album.span === "wide" && "col-span-2",
                album.span === "tall" && "row-span-2",
              )}
            >
              <Image
                src={coverSrc}
                alt={album.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                style={{ objectPosition: album.focus || focusFor(coverSrc) }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle/85 via-jungle/15 to-transparent opacity-95" />
              {count > 1 && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-jungle/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foam backdrop-blur">
                  <Images className="h-3 w-3" />
                  {count} photos
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun">
                  {album.category === "trips" ? "Our trips" : album.category}
                </p>
                <p className="mt-0.5 font-display text-sm leading-snug text-foam sm:text-base">
                  {album.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {openAlbum && activePhoto && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-jungle/90 p-3 backdrop-blur-md sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${openAlbum.title} album`}
        >
          <div
            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.25rem] bg-foam shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <div>
                <p className="font-display text-base text-jungle sm:text-lg">
                  {openAlbum.title}
                </p>
                <p className="text-xs text-muted sm:text-sm">
                  {photoIndex + 1} / {openAlbum.photos.length}
                  <span className="mx-2 text-line">·</span>
                  <span className="capitalize text-lagoon">
                    {openAlbum.category === "trips" ? "Our trips" : openAlbum.category}
                  </span>
                </p>
              </div>
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
                  src={activePhoto.src}
                  alt={activePhoto.title || openAlbum.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 960px"
                  priority
                />
              </div>

              {openAlbum.photos.length > 1 && (
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
                {activePhoto.title || openAlbum.title}
              </h3>

              {openAlbum.photos.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {openAlbum.photos.map((img: ShowcasePhoto, i: number) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      className={cn(
                        "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                        i === photoIndex
                          ? "border-sun"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                      aria-label={`Go to ${img.title || openAlbum.title}`}
                      aria-current={i === photoIndex}
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
