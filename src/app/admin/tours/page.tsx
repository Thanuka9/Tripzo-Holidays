"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { TourRecord } from "@/lib/db";
import type { TourDay } from "@/lib/tours";

export default function AdminToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<TourRecord | null>(null);

  async function load() {
    const res = await fetch("/api/tours");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setTours(data.tours || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    const form = e.currentTarget;
    const body = new FormData(form);
    const res = await fetch("/api/tours", { method: "POST", body });
    setPending(false);
    const text = await res.text();
    let data: { error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      /* ignore */
    }
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    form.reset();
    setEditing(null);
    setMessage("Package saved. It will appear on Tours & transfers.");
    await load();
  }

  async function onDelete(slug: string) {
    if (!confirm("Delete this package from the website?")) return;
    const res = await fetch("/api/tours", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Delete failed");
      return;
    }
    setMessage("Package removed");
    if (editing?.slug === slug) setEditing(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Tours & transfers</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Add or edit tour packages, day trips, and transfers. Changes publish on
        the public Tours pages and booking form.
      </p>

      <TourForm
        key={editing?.slug || "new"}
        editing={editing}
        pending={pending}
        message={message}
        onCancel={() => setEditing(null)}
        onSave={onSave}
      />

      <div className="mt-10 space-y-4">
        {tours.map((tour) => (
          <article
            key={tour.slug}
            className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[140px_1fr_auto]"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image src={tour.image} alt={tour.title} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{tour.title}</h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] uppercase text-zinc-400">
                  {tour.category}
                </span>
                {tour.featured && (
                  <span className="rounded-full bg-sun/20 px-2 py-0.5 text-[11px] text-sun">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-sun">{tour.duration}</p>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{tour.summary}</p>
            </div>
            <div className="flex gap-2 place-self-start">
              <button
                type="button"
                onClick={() => {
                  setEditing(tour);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full border border-white/15 p-2 hover:bg-white/5"
                aria-label={`Edit ${tour.title}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(tour.slug)}
                className="rounded-full border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10"
                aria-label={`Delete ${tour.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TourForm({
  editing,
  pending,
  message,
  onSave,
  onCancel,
}: {
  editing: TourRecord | null;
  pending: boolean;
  message: string;
  onSave: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const days: TourDay[] = editing?.itinerary || [];
  const itineraryJson = JSON.stringify(days, null, 2);

  return (
    <form
      onSubmit={onSave}
      className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
    >
      <p className="sm:col-span-2 text-sm font-medium text-sun">
        {editing ? `Editing: ${editing.title}` : "Add a new package"}
      </p>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Slug (URL)</span>
        <input
          name="slug"
          defaultValue={editing?.slug || ""}
          readOnly={Boolean(editing)}
          placeholder="seven-days-sri-lanka"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none read-only:opacity-70"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Title</span>
        <input
          name="title"
          required
          defaultValue={editing?.title || ""}
          placeholder="Seven Days Sri Lanka"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Subtitle</span>
        <input
          name="subtitle"
          defaultValue={editing?.subtitle || ""}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Duration</span>
        <input
          name="duration"
          defaultValue={editing?.duration || ""}
          placeholder="7 Days / 6 Nights"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Days</span>
        <input
          name="days"
          type="number"
          min={1}
          defaultValue={editing?.days || 1}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Price from</span>
        <input
          name="priceFrom"
          defaultValue={editing?.priceFrom || ""}
          placeholder="Custom quote"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Type</span>
        <select
          name="category"
          defaultValue={editing?.category || "tour"}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        >
          <option value="tour">Multi-day tour</option>
          <option value="day">Day trip</option>
          <option value="transfer">Transfer</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm text-zinc-300">Summary</span>
        <textarea
          name="summary"
          required
          rows={3}
          defaultValue={editing?.summary || ""}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm text-zinc-300">
          Highlights (one per line)
        </span>
        <textarea
          name="highlights"
          rows={4}
          defaultValue={(editing?.highlights || []).join("\n")}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm text-zinc-300">
          Itinerary JSON (optional)
        </span>
        <textarea
          name="itinerary"
          rows={8}
          defaultValue={editing ? itineraryJson : ""}
          placeholder='[{"day":1,"title":"Airport to Sigiriya","description":"...","highlights":["Pickup"]}]'
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs outline-none"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm text-zinc-300">PDF path (optional)</span>
        <input
          name="pdfUrl"
          defaultValue={editing?.pdfUrl || ""}
          placeholder="/Packages/itinerary.pdf"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm text-zinc-300">Cover photo</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:text-sm file:font-semibold file:text-jungle"
        />
      </label>
      {editing?.image && (
        <input type="hidden" name="existingImage" value={editing.image} />
      )}
      <label className="flex items-center gap-2 text-sm text-zinc-300 sm:col-span-2">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={editing?.featured}
          className="rounded"
        />
        Featured on home page
      </label>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {editing ? "Update package" : "Add package"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-4 py-3 text-sm"
          >
            Cancel edit
          </button>
        )}
      </div>
      {message && <p className="text-sm text-zinc-300 sm:col-span-2">{message}</p>}
    </form>
  );
}
