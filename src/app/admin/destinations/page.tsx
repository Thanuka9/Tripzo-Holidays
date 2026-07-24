"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { DestinationRecord } from "@/lib/db";

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<DestinationRecord[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/destinations");
    const data = await res.json();
    setDestinations(data.destinations || []);
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
    const res = await fetch("/api/destinations", { method: "POST", body });
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
    setMessage("Destination saved — it will appear on the website.");
    await load();
  }

  async function onDelete(id: string) {
    const res = await fetch("/api/destinations", {
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

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Destinations</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Add places you visit — photos show on the home page and destinations page.
        Upload Sigiriya, Temple of the Tooth, Nuwara Eliya, beaches, and more.
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <Field name="id" label="ID (slug)" placeholder="sigiriya" />
        <Field name="name" label="Place name" placeholder="Sigiriya" required />
        <Field name="region" label="Region" placeholder="Cultural Triangle" />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Description</span>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
            placeholder="Short description for visitors"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="featured" defaultChecked className="rounded" />
          Show on home page
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="slideshow" className="rounded" />
          Include in hero slideshow pool
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Photo</span>
          <input
            type="file"
            name="file"
            accept="image/*"
            className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sun file:px-4 file:py-2 file:text-sm file:font-semibold file:text-jungle"
          />
          <span className="mt-1 block text-xs text-zinc-500">
            Tip: use a clear landscape photo of the real place in Sri Lanka.
          </span>
        </label>
        <Field
          name="existingImage"
          label="Or existing image path"
          placeholder="/images/destinations/sigiriya.jpg"
          className="sm:col-span-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle sm:col-span-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save destination
        </button>
        {message && <p className="text-sm text-zinc-300 sm:col-span-2">{message}</p>}
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {destinations.map((d) => (
          <article
            key={d.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            <div className="relative aspect-[16/10]">
              <Image src={d.image} alt={d.name} fill className="object-cover" />
            </div>
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <h2 className="font-semibold text-white">{d.name}</h2>
                <p className="text-xs uppercase tracking-wider text-sun">{d.region}</p>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{d.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(d.id)}
                className="rounded-full border border-white/15 p-2 text-red-300 hover:bg-white/10"
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
