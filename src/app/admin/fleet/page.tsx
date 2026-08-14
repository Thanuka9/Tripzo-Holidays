"use client";

import { FormEvent, useEffect, useState } from "react";
import { SiteImage as Image } from "@/components/SiteImage";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type { FleetRecord } from "@/lib/db";
import { cn } from "@/lib/utils";

export default function AdminFleetPage() {
  const router = useRouter();
  const [fleet, setFleet] = useState<FleetRecord[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/fleet");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setFleet(data.fleet || []);
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
    const res = await fetch("/api/fleet", { method: "POST", body });
    setPending(false);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Save failed");
      return;
    }
    form.reset();
    setMessage("Vehicle saved");
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this vehicle from the fleet?")) return;
    const res = await fetch("/api/fleet", {
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
    setMessage("Vehicle removed");
    await load();
  }

  async function moveVehicle(id: string, direction: -1 | 1) {
    const index = fleet.findIndex((v) => v.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= fleet.length) return;
    const next = [...fleet];
    [next[index], next[target]] = [next[target], next[index]];
    setFleet(next);
    const res = await fetch("/api/fleet", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedVehicleIds: next.map((v) => v.id) }),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Reorder failed");
      await load();
    }
  }

  async function patchVehicle(body: Record<string, unknown>) {
    const res = await fetch("/api/fleet", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Update failed");
      return null;
    }
    return data.vehicle as FleetRecord;
  }

  async function moveGalleryImage(
    vehicle: FleetRecord,
    src: string,
    direction: -1 | 1,
  ) {
    const gallery = [...(vehicle.gallery || [vehicle.image])];
    const index = gallery.indexOf(src);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= gallery.length) return;
    [gallery[index], gallery[target]] = [gallery[target], gallery[index]];
    const updated = await patchVehicle({
      id: vehicle.id,
      gallery,
      mainImage: vehicle.image,
    });
    if (updated) {
      setFleet((list) => list.map((v) => (v.id === updated.id ? updated : v)));
    }
  }

  async function setMainImage(vehicleId: string, src: string) {
    const updated = await patchVehicle({ id: vehicleId, mainImage: src });
    if (updated) {
      setFleet((list) => list.map((v) => (v.id === updated.id ? updated : v)));
      setMessage("Main photo updated");
    }
  }

  async function removeGalleryImage(vehicleId: string, src: string) {
    if (!confirm("Remove this photo from the vehicle?")) return;
    const updated = await patchVehicle({ id: vehicleId, removeImage: src });
    if (updated) {
      setFleet((list) => list.map((v) => (v.id === updated.id ? updated : v)));
      setMessage("Photo removed");
    }
  }

  async function addGalleryPhoto(vehicleId: string, file: File) {
    setPending(true);
    const body = new FormData();
    body.set("id", vehicleId);
    body.set("file", file);
    const res = await fetch("/api/fleet", { method: "PATCH", body });
    setPending(false);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Upload failed");
      return;
    }
    setFleet((list) =>
      list.map((v) => (v.id === data.vehicle.id ? data.vehicle : v)),
    );
    setMessage("Photo added");
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Fleet</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Reorder vehicles, manage each vehicle’s photo gallery, choose the main
        cover image, and add or remove photos.
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <Field name="id" label="ID (slug)" placeholder="luxury-coach" />
        <Field name="name" label="Name" placeholder="Luxury Bus" required />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Description</span>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
          />
        </label>
        <Field name="capacity" label="Capacity" placeholder="Up to 26+ passengers" />
        <Field name="idealFor" label="Ideal for" placeholder="Large groups & events" />
        <Field
          name="features"
          label="Features (comma separated)"
          placeholder="Air-conditioned, Luggage space"
          className="sm:col-span-2"
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Cover photo</span>
          <input
            type="file"
            name="file"
            accept="image/*"
            className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:text-sm file:font-semibold file:text-jungle"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle sm:col-span-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save vehicle
        </button>
        {message && <p className="text-sm text-zinc-300 sm:col-span-2">{message}</p>}
      </form>

      <div className="mt-10 space-y-5">
        {fleet.map((v, index) => {
          const gallery = v.gallery?.length ? v.gallery : [v.image];
          const open = expanded === v.id;
          return (
            <article
              key={v.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr_auto]">
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                  <Image src={v.image} alt={v.name} fill className="object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase text-jungle">
                    Main
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{v.name}</h2>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-zinc-400">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {v.description}
                  </p>
                  <p className="mt-2 text-xs text-sun">
                    {v.capacity} · {v.idealFor} · {gallery.length} photos
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveVehicle(v.id, -1)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs disabled:opacity-40"
                    >
                      <ArrowUp className="h-3.5 w-3.5" /> Up
                    </button>
                    <button
                      type="button"
                      disabled={index === fleet.length - 1}
                      onClick={() => moveVehicle(v.id, 1)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs disabled:opacity-40"
                    >
                      <ArrowDown className="h-3.5 w-3.5" /> Down
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : v.id)}
                      className="rounded-full border border-sun/40 bg-sun/10 px-3 py-1.5 text-xs text-sun"
                    >
                      {open ? "Hide photos" : "Edit photos"}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(v.id)}
                  className="h-10 w-10 place-self-start rounded-full border border-red-400/30 p-2 text-red-300 hover:bg-red-400/10"
                  aria-label={`Delete ${v.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {open && (
                <div className="border-t border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-zinc-300">
                      Reorder photos, set main cover, add or remove.
                    </p>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-sun px-3 py-1.5 text-xs font-semibold text-jungle">
                      <Upload className="h-3.5 w-3.5" />
                      Add photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) addGalleryPhoto(v.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((src, photoIndex) => {
                      const isMain = src === v.image;
                      return (
                        <div
                          key={`${v.id}-${src}-${photoIndex}`}
                          className={cn(
                            "overflow-hidden rounded-2xl border bg-white/5",
                            isMain ? "border-sun/50" : "border-white/10",
                          )}
                        >
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={src}
                              alt={`${v.name} ${photoIndex + 1}`}
                              fill
                              className="object-cover"
                              sizes="280px"
                            />
                            {isMain && (
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase text-jungle">
                                <Star className="h-3 w-3" /> Main
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 p-2">
                            <button
                              type="button"
                              disabled={photoIndex === 0}
                              onClick={() => moveGalleryImage(v, src, -1)}
                              className="rounded-full border border-white/15 px-2 py-1 text-[11px] disabled:opacity-40"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              disabled={photoIndex === gallery.length - 1}
                              onClick={() => moveGalleryImage(v, src, 1)}
                              className="rounded-full border border-white/15 px-2 py-1 text-[11px] disabled:opacity-40"
                            >
                              →
                            </button>
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => setMainImage(v.id, src)}
                                className="rounded-full border border-sun/40 px-2 py-1 text-[11px] text-sun"
                              >
                                Set main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(v.id, src)}
                              className="rounded-full border border-red-400/30 px-2 py-1 text-[11px] text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
  className = "",
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}
