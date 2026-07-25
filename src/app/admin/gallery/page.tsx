"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Replace,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type { GalleryImage, GalleryKind } from "@/lib/db";
import { cn } from "@/lib/utils";

type Tab = GalleryKind;

export default function AdminGalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<Tab>("hero");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/gallery");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setGallery(data.gallery || []);
  }

  useEffect(() => {
    load();
  }, []);

  const items = useMemo(
    () => gallery.filter((g) => (g.kind || "general") === kind),
    [gallery, kind],
  );

  const mainId =
    items.find((g) => g.featured)?.id || items[0]?.id || null;

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
      kind === "hero"
        ? "Hero slide added — appears on the home page slideshow."
        : kind === "team"
          ? "Trip photo uploaded — shows on Home and Gallery → Our trips."
          : "Photo uploaded to the gallery.",
    );
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this image?")) return;
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Delete failed");
      return;
    }
    setMessage("Image removed.");
    await load();
  }

  async function move(id: string, direction: -1 | 1) {
    const list = [...items];
    const index = list.findIndex((g) => g.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    const swapped = [...list];
    [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
    const res = await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: swapped.map((g) => g.id) }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Reorder failed");
      return;
    }
    const data = await res.json();
    setGallery(data.gallery || []);
  }

  async function setMain(id: string) {
    const res = await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, setMain: true }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Could not set main image");
      return;
    }
    const data = await res.json();
    setGallery(data.gallery || []);
    setMessage(
      kind === "hero"
        ? "Main hero slide updated (first shown on home)."
        : kind === "team"
          ? "Main trip photo updated (featured on home)."
          : "Main gallery cover updated.",
    );
  }

  async function onReplace(id: string, file: File) {
    setPending(true);
    setMessage("");
    const body = new FormData();
    body.set("id", id);
    body.set("file", file);
    const res = await fetch("/api/gallery", { method: "PATCH", body });
    setPending(false);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Replace failed");
      return;
    }
    setMessage("Image replaced.");
    await load();
  }

  async function onSaveMeta(id: string, fields: Partial<GalleryImage>) {
    const res = await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Save failed");
      return;
    }
    setMessage("Details saved.");
    setEditingId(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Images</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Same controls as fleet photos: reorder, set the main cover, replace,
        add, or remove. Hero slides power the home slideshow; trip photos and
        gallery uploads show on the public site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["hero", "Hero slideshow"],
            ["team", "Team trip photos"],
            ["general", "Gallery uploads"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setKind(id);
              setEditingId(null);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              kind === id
                ? "bg-sun text-jungle"
                : "border border-white/15 text-zinc-300",
            )}
          >
            {label} (
            {gallery.filter((g) => (g.kind || "general") === id).length})
          </button>
        ))}
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
            placeholder={
              kind === "hero"
                ? "Sigiriya Rock Fortress"
                : kind === "team"
                  ? "Sunset at Galle with guests"
                  : "Ella Nine Arch"
            }
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-zinc-300">
            {kind === "hero" ? "Caption" : "Place"}
          </span>
          <input
            name={kind === "hero" ? "caption" : "place"}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            placeholder={
              kind === "hero"
                ? "Cultural Triangle · Ancient Sri Lanka"
                : "Sigiriya, Ella, Mirissa…"
            }
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
              placeholder="e.g. Family from Germany"
            />
          </label>
        )}
        {kind !== "hero" && (
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm text-zinc-300">Caption</span>
            <input
              name="caption"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
              placeholder="Optional short story"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle sm:col-span-2 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Add{" "}
          {kind === "hero"
            ? "hero slide"
            : kind === "team"
              ? "trip photo"
              : "gallery photo"}
        </button>
        {message && (
          <p className="text-sm text-zinc-300 sm:col-span-2">{message}</p>
        )}
      </form>

      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-sun">
              {kind === "hero"
                ? "Hero slideshow"
                : kind === "team"
                  ? "Team trip photos"
                  : "Gallery uploads"}{" "}
              ({items.length})
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Reorder with ← → · Set main cover · Replace or remove
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Nothing in this section yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((img, index) => {
              const isMain = img.id === mainId;
              return (
                <article
                  key={img.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white/5",
                    isMain ? "border-sun/50" : "border-white/10",
                  )}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    {isMain && (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase text-jungle">
                        <Star className="h-3 w-3" /> Main
                      </span>
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-sm font-medium text-white">
                      {img.title}
                    </p>
                    {(img.place || img.caption) && (
                      <p className="truncate text-xs text-zinc-400">
                        {[img.place, img.caption].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => move(img.id, -1)}
                        className="rounded-full border border-white/15 px-2 py-1 text-[11px] disabled:opacity-40"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        disabled={index === items.length - 1}
                        onClick={() => move(img.id, 1)}
                        className="rounded-full border border-white/15 px-2 py-1 text-[11px] disabled:opacity-40"
                      >
                        →
                      </button>
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => setMain(img.id)}
                          className="rounded-full border border-sun/40 px-2 py-1 text-[11px] text-sun"
                        >
                          Set main
                        </button>
                      )}
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] hover:bg-white/5">
                        <Replace className="h-3 w-3" /> Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onReplace(img.id, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(editingId === img.id ? null : img.id)
                        }
                        className="rounded-full border border-white/15 px-2 py-1 text-[11px]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(img.id)}
                        className="rounded-full border border-red-400/30 px-2 py-1 text-[11px] text-red-300"
                      >
                        <Trash2 className="inline h-3 w-3" /> Remove
                      </button>
                    </div>

                    {editingId === img.id && (
                      <MetaEditor
                        img={img}
                        onSave={onSaveMeta}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaEditor({
  img,
  onSave,
  onCancel,
}: {
  img: GalleryImage;
  onSave: (id: string, fields: Partial<GalleryImage>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(img.title);
  const [caption, setCaption] = useState(img.caption || "");
  const [place, setPlace] = useState(img.place || "");
  const [people, setPeople] = useState(img.people || "");

  useEffect(() => {
    setTitle(img.title);
    setCaption(img.caption || "");
    setPlace(img.place || "");
    setPeople(img.people || "");
  }, [img]);

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-black/30 p-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs outline-none"
        placeholder="Title"
      />
      <input
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs outline-none"
        placeholder="Place"
      />
      <input
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs outline-none"
        placeholder="People"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 text-xs outline-none"
        placeholder="Caption"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onSave(img.id, {
              title,
              caption: caption || undefined,
              place: place || undefined,
              people: people || undefined,
            })
          }
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-sun px-2 py-1.5 text-[11px] font-semibold text-jungle"
        >
          <Save className="h-3 w-3" /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/15 px-2 py-1.5 text-[11px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
