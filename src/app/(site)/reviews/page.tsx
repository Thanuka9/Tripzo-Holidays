import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getApprovedReviews } from "@/lib/db";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsSection } from "@/components/ReviewsSection";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Guest reviews for Tripzo Holidays from Google and travelers across Sri Lanka.",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <div>
      <section className="bg-jungle px-4 py-16 text-foam sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sun">
            Google · 4.8 ★
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Reviews
          </h1>
          <p className="mt-4 max-w-xl text-foam/80">
            Feedback from travelers who toured with {SITE.chauffeur} and the Tripzo Holidays
            team.
          </p>
          <a
            href={SITE.googleMapsReviews}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-sun px-5 py-2.5 text-sm font-bold text-jungle"
          >
            Open Google reviews
          </a>
        </div>
      </section>

      <ReviewsSection reviews={reviews} showFormLink={false} tone="light" />

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h2 className="font-display text-3xl text-jungle">Leave your review</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Share your Tripzo experience here — or leave a review on our{" "}
              <a
                href={SITE.googleMapsReviews}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-lagoon underline"
              >
                Google Business profile
              </a>
              .
            </p>
          </div>
          <ReviewForm />
        </div>
      </section>
    </div>
  );
}
