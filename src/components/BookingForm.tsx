"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { tours } from "@/lib/tours";
import { defaultFleet } from "@/lib/fleet";
import { useWhatsAppLink } from "@/components/SiteContactProvider";

type Props = {
  defaultTour?: string;
  compact?: boolean;
};

export function BookingForm({ defaultTour, compact }: Props) {
  const params = useSearchParams();
  const wa = useWhatsAppLink();
  const initialTour = defaultTour || params.get("tour") || "";
  const initialVehicle = params.get("vehicle") || "";
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          travelers: Number(payload.travelers || 1),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setBookingId(data.booking.id);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-line bg-foam p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-leaf" />
        <h3 className="mt-4 font-display text-2xl text-jungle">Request received</h3>
        <p className="mt-2 text-sm text-muted">
          We will confirm your journey shortly. Reference:{" "}
          <span className="font-semibold text-jungle">{bookingId.slice(0, 8)}</span>
        </p>
        <a
          href={wa(
            `Hi Tripzo! I just submitted a booking request (ref ${bookingId.slice(0, 8)}). Looking forward to hearing from you.`,
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-3xl border border-line bg-foam ${compact ? "p-5" : "p-6 sm:p-8"}`}
    >
      {!compact && (
        <div className="mb-6">
          <h2 className="font-display text-2xl text-jungle">Book your journey</h2>
          <p className="mt-1 text-sm text-muted">
            Share a few details and we will get back with availability and pricing.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone / WhatsApp" name="phone" required />
        <Field
          label="Travelers"
          name="travelers"
          type="number"
          min={1}
          defaultValue={2}
          required
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Tour package</span>
          <select
            name="tourSlug"
            defaultValue={initialTour}
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          >
            <option value="">Select a package (optional)</option>
            {tours.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Preferred vehicle</span>
          <select
            name="vehicleId"
            defaultValue={initialVehicle}
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          >
            <option value="">Any suitable vehicle</option>
            {defaultFleet.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <Field label="Start date" name="startDate" type="date" required />
        <Field label="Pickup location" name="pickup" placeholder="Airport / hotel / city" />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-jungle">Message</span>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your plans..."
            className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle px-5 py-3.5 text-sm font-semibold text-foam transition hover:bg-leaf disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Sending..." : "Submit booking request"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  defaultValue?: string | number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-jungle">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-mist/40 px-4 py-3 text-sm outline-none ring-lagoon focus:ring-2"
      />
    </label>
  );
}
