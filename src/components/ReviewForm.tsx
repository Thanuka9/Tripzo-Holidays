"use client";

import { FormEvent, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          country: form.get("country") || undefined,
          tourTitle: form.get("tourTitle") || undefined,
          comment: form.get("comment"),
          rating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
      e.currentTarget.reset();
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-line bg-mist/60 p-6 text-center">
        <p className="font-display text-2xl text-jungle">Thank you!</p>
        <p className="mt-2 text-sm text-muted">
          Your feedback was sent. It will appear on the site after the Tripzo team reviews it.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 text-sm font-semibold text-leaf"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-foam p-6 shadow-sm sm:p-8"
    >
      <h3 className="font-display text-2xl text-jungle">Share your experience</h3>
      <p className="mt-1 text-sm text-muted">
        Tell future travelers how your Tripzo journey felt.
      </p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-jungle">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} stars`}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  n <= rating ? "fill-sun text-sun" : "text-line",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Name</span>
          <input
            name="name"
            required
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Country</span>
          <input
            name="country"
            placeholder="Optional"
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Tour / trip</span>
          <input
            name="tourTitle"
            placeholder="e.g. 7-day tour, airport transfer"
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Your feedback</span>
          <textarea
            name="comment"
            required
            rows={4}
            minLength={10}
            placeholder="What did you enjoy most?"
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle px-5 py-3.5 text-sm font-semibold text-foam hover:bg-leaf disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit review
      </button>
    </form>
  );
}
