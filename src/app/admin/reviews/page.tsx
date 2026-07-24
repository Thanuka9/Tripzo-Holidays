"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import type { Review, ReviewStatus } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/reviews?all=1");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: ReviewStatus) {
    await fetch("/api/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  async function remove(id: string) {
    await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  if (loading) return <p className="text-zinc-400">Loading reviews...</p>;

  const pending = reviews.filter((r) => r.status === "pending").length;

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Reviews</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Approve guest feedback before it appears on the website. {pending} pending.
      </p>

      <div className="mt-8 space-y-4">
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-zinc-500">
            No reviews yet.
          </p>
        )}
        {reviews.map((r) => (
          <article
            key={r.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{r.name}</h2>
                <p className="text-sm text-zinc-400">
                  {[r.country, r.tourTitle].filter(Boolean).join(" · ") || "Guest"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs uppercase tracking-wider",
                  r.status === "approved" && "bg-emerald-500/20 text-emerald-300",
                  r.status === "pending" && "bg-sun/20 text-sun",
                  r.status === "hidden" && "bg-white/10 text-zinc-400",
                )}
              >
                {r.status}
              </span>
            </div>
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < r.rating ? "fill-sun text-sun" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-zinc-300">“{r.comment}”</p>
            <p className="mt-2 text-xs text-zinc-500">{formatDate(r.createdAt)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["approved", "pending", "hidden"] as ReviewStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatus(r.id, status)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs capitalize hover:bg-white/10"
                >
                  {status}
                </button>
              ))}
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="inline-flex items-center gap-1 rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
