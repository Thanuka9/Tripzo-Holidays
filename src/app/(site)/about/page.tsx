import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: "About Tripzo Cabs & Tours — reliable Sri Lanka transport and tour experiences.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden">
        <Image
          src="/images/destinations/hero-ella.jpg"
          alt="Scenic train journey through Sri Lanka hill country"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-jungle/70" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl items-end px-4 pb-12 sm:px-6">
          <h1 className="font-display text-4xl font-semibold text-foam sm:text-5xl">
            About Tripzo
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-display text-2xl leading-relaxed text-jungle text-balance">
          {SITE.tagline}
        </p>
        <p className="mt-6 leading-relaxed text-muted">
          {SITE.description} Whether you need a punctual airport transfer, a private day tour,
          or a full island circuit with scenic trains and wildlife safaris, Tripzo pairs
          comfortable vehicles with routes designed for real travelers.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We serve locals and visitors across Sri Lanka — from Colombo and the Cultural
          Triangle to Kandy, Nuwara Eliya, Ella, Yala, and the southern coast. Your journey
          stays flexible, clear, and personal.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Focus", value: "Tours + transport" },
            { label: "Coverage", value: "Island-wide" },
            { label: "Support", value: "WhatsApp & phone" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-mist/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-lagoon">{item.label}</p>
              <p className="mt-1 font-display text-xl text-jungle">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
