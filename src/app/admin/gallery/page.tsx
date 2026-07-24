"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Upload } from "lucide-react";
import type { GalleryImage } from "@/lib/db";
import { cn } from "@/lib/utils";

export default function AdminGalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<"general" | "team">("team");

  async function load() {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGallery(data.gallery || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    const form = e.currentTarget;
    const body = new FormData(form);
    body.set("kind", kind);
    const res = await fetch("/api/gallery", { method: "POST", body });
    setPending(false);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Upload failed");
      return;
    }
    form.reset();
    setMessage(
      kind === "team"
        ? "Trip photo uploaded — it shows on Home (Real trip moments) and Gallery → Our trips."
        : "Photo uploaded to the gallery.",
    );
    await load();
  }

  async function onDelete(id: string) {
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    await load();
  }

  const team = gallery.filter((g) => g.kind === "team");
  const general = gallery.filter((g) => g.kind !== "team");

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Trip photos & gallery</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Cab team: upload pictures you took with guests or at places. They appear on the{" "}
        <span className="text-sun">home page</span> (“Real trip moments”) and in{" "}
        <span className="text-sun">Gallery → Our trips</span>.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setKind("team")}
          className={cn(
            "rounded-full px-4 py-2 text-sm",
            kind === "team" ? "bg-sun text-jungle" : "border border-white/15 text-zinc-300",
          )}
        >
          Team trip photo
        </button>
        <button
          type="button"
          onClick={() => setKind("general")}
          className={cn(
            "rounded-full px-4 py-2 text-sm",
            kind === "general" ? "bg-sun text-jungle" : "border border-white/15 text-zinc-300",
          )}
        >
          General gallery
        </button>
      </div>

      <form
        onSubmit={onUpload}
        className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Photo file</span>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:text-sm file:font-semibold file:text-jungle"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-zinc-300">Title</span>
          <input
            name="title"
            required
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            placeholder={kind === "team" ? "Sunset at Galle with guests" : "Ella Nine Arch"}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-zinc-300">Place</span>
          <input
            name="place"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            placeholder="Sigiriya, Ella, Mirissa…"
          />
        </label>
        {kind === "team" && (
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm text-zinc-300">
              People / guests (optional)
            </span>
            <input
              name="people"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
              placeholder="e.g. Family from Germany, couple from UK"
            />
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Caption</span>
          <input
            name="caption"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            placeholder="Optional short story"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle sm:col-span-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {kind === "team" ? "Upload trip photo" : "Upload gallery photo"}
        </button>
        {message && <p className="text-sm text-zinc-300 sm:col-span-2">{message}</p>}
      </form>

      <PhotoGrid title="Team trip photos" items={team} onDelete={onDelete} />
      <PhotoGrid title="General uploads" items={general} onDelete={onDelete} />
    </div>
  );
}

function PhotoGrid({
  title,
  items,
  onDelete,
}: {
  title: string;
  items: GalleryImage[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl text-sun">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">Nothing uploaded yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img) => (
            <figure
              key={img.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-[4/3]">
                <Image src={img.src} alt={img.title} fill className="object-cover" />
              </div>
              <figcaption className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <span className="block truncate text-sm font-medium">{img.title}</span>
                  {(img.place || img.people) && (
                    <span className="mt-0.5 block truncate text-xs text-zinc-400">
                      {[img.place, img.people].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(img.id)}
                  className="rounded-full p-2 text-red-300 hover:bg-white/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
