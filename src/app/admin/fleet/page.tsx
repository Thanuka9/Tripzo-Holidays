"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { FleetRecord } from "@/lib/db";

export default function AdminFleetPage() {
  const router = useRouter();
  const [fleet, setFleet] = useState<FleetRecord[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/fleet");
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
    const res = await fetch("/api/fleet", {
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
      <h1 className="font-display text-3xl text-sun">Fleet</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Add or update vehicles shown on the public fleet page.
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2"
      >
        <Field name="id" label="ID (slug)" placeholder="prius" />
        <Field name="name" label="Name" placeholder="Toyota Prius" required />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Description</span>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
          />
        </label>
        <Field name="capacity" label="Capacity" placeholder="1–3 passengers" />
        <Field name="idealFor" label="Ideal for" placeholder="Airport transfers" />
        <Field
          name="features"
          label="Features (comma separated)"
          placeholder="Air-conditioned, Luggage space"
          className="sm:col-span-2"
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-zinc-300">Photo</span>
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

      <div className="mt-8 space-y-4">
        {fleet.map((v) => (
          <article
            key={v.id}
            className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[140px_1fr_auto]"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image src={v.image} alt={v.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{v.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{v.description}</p>
              <p className="mt-2 text-xs text-sun">
                {v.capacity} · {v.idealFor}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(v.id)}
              className="h-10 w-10 place-self-start rounded-full border border-white/15 p-2 text-red-300 hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
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
