import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { GalleryShowcase } from "@/components/GalleryShowcase";
import {
  getContactSettings,
  getFeaturedGalleryCover,
  getPublicGalleryUploads,
} from "@/lib/db";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Sri Lanka gallery  -  Sigiriya, Temple of the Tooth, Ella, tea country, beaches, wildlife, and real Tripzo team trip photos.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [uploaded, contact, cover] = await Promise.all([
    getPublicGalleryUploads(),
    getContactSettings(),
    getFeaturedGalleryCover(),
  ]);
  const teamCount = uploaded.filter((g) => g.kind === "team").length;
  const heroSrc = cover?.src || "/images/gallery/gallery-ella.jpg";
  const heroAlt = cover?.title || "Nine Arch Bridge Ella Sri Lanka";

  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden">
        <Image
          src={heroSrc}
          alt={heroAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/55 to-jungle/45" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-[var(--site-header-height)] sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sun">
            Visual journey
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foam sm:text-5xl">
            Sri Lanka gallery
          </h1>
          <p className="mt-3 max-w-xl text-foam/85">
            Landmarks across the island  -  plus real photos from our cab team with guests on the
            road.
            {teamCount > 0
              ? ` ${teamCount} trip photo${teamCount === 1 ? "" : "s"} from the team.`
              : ""}
          </p>
        </div>
      </section>

      <section className="bg-island px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-mist" />}>
            <GalleryShowcase
              uploads={uploaded.map((g) => ({
                id: g.id,
                src: g.src,
                title: g.title,
                kind: g.kind,
                place: g.place,
                people: g.people,
                caption: g.caption,
                category: g.category,
              }))}
            />
          </Suspense>

          <div className="mt-14 rounded-[1.75rem] bg-jungle px-6 py-10 text-center text-foam sm:px-10">
            <h2 className="font-display text-2xl sm:text-3xl">Want photos from your own trip?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-foam/80">
              Book a journey with Tripzo  -  our team often captures memories at Sigiriya, Ella,
              Yala, and the coast to share with you.
            </p>
            <a
              href={whatsappLink(
                "Hi Tripzo! I loved the gallery  -  I'd like to plan a tour.",
                contact.whatsapp,
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-sun px-5 py-3 text-sm font-bold text-jungle"
            >
              Plan on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
