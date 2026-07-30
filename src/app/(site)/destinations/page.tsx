import type { Metadata } from "next";
import { DestinationsGrid } from "@/components/DestinationsGrid";
import { getDestinations } from "@/lib/db";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Places Tripzo Cabs & Tours visits across Sri Lanka  -  Sigiriya, Temple of the Tooth, Nuwara Eliya, Ella, Yala, beaches, and more.",
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="bg-island pb-8 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
          Across the island
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-jungle sm:text-5xl">
          Destinations we visit
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          From the Cultural Triangle to tea country, wildlife parks, and the southern coast  - 
          every Tripzo journey is built around Sri Lanka’s most memorable places.
        </p>
      </div>
      <DestinationsGrid
        destinations={destinations}
        title="Explore our route stops"
        subtitle="Real places on the Tripzo map  -  heritage, hills, safari, and sea."
        showAllLink={false}
      />
    </div>
  );
}
