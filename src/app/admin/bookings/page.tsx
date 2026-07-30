"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  List,
  Mail,
  Phone,
  Users,
  MapPin,
  Car,
  Trash2,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/db";
import { BookingCalendar } from "@/components/admin/BookingCalendar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/constants";

const statuses: BookingStatus[] = ["new", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  async function load() {
    const res = await fetch("/api/admin/bookings");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: BookingStatus) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  async function removeBooking(id: string) {
    if (
      !confirm(
        "Permanently remove this appointment from the calendar? This cannot be undone.",
      )
    ) {
      return;
    }
    const res = await fetch("/api/admin/bookings", {
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
      alert(data.error || "Could not delete booking");
      return;
    }
    setSelected(null);
    await load();
  }

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (selectedDate) list = list.filter((b) => b.startDate?.slice(0, 10) === selectedDate);
    return list;
  }, [bookings, statusFilter, selectedDate]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...bookings]
      .filter((b) => b.startDate >= today && b.status !== "cancelled")
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 5);
  }, [bookings]);

  if (loading) {
    return <p className="text-zinc-400">Loading bookings...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-sun">Bookings calendar</h1>
          <p className="mt-2 text-sm text-zinc-400">
            See every trip on the calendar, open details, and update status.
          </p>
        </div>
        <div className="flex rounded-full border border-white/15 p-1">
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
              view === "calendar" ? "bg-sun text-jungle" : "text-zinc-300",
            )}
          >
            <CalendarDays className="h-4 w-4" /> Calendar
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
              view === "list" ? "bg-sun text-jungle" : "text-zinc-300",
            )}
          >
            <List className="h-4 w-4" /> List
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
          label={`All (${bookings.length})`}
        />
        {statuses.map((s) => (
          <FilterChip
            key={s}
            active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
            label={`${s} (${bookings.filter((b) => b.status === s).length})`}
          />
        ))}
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="rounded-full border border-sun/40 bg-sun/10 px-3 py-1.5 text-xs text-sun"
          >
            Clear date {selectedDate} � - 
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div>
          {view === "calendar" ? (
            <BookingCalendar
              bookings={
                statusFilter === "all"
                  ? bookings
                  : bookings.filter((b) => b.status === statusFilter)
              }
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectBooking={setSelected}
            />
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-zinc-500">
                  No bookings for this filter.
                </p>
              )}
              {filtered.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelected(b)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-sm text-zinc-400">
                        {b.startDate} · {b.tourTitle || "Custom / transfer"}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-sun">
                      {b.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-display text-xl text-sun">Upcoming</h2>
            <div className="mt-4 space-y-3">
              {upcoming.length === 0 && (
                <p className="text-sm text-zinc-500">No upcoming trips yet.</p>
              )}
              {upcoming.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelected(b);
                    setSelectedDate(b.startDate.slice(0, 10));
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left hover:border-sun/40"
                >
                  <p className="text-sm font-medium text-white">{b.name}</p>
                  <p className="text-xs text-zinc-400">
                    {b.startDate} · {b.travelers} guests
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selected ? (
            <BookingDetail
              booking={selected}
              onStatus={updateStatus}
              onDelete={removeBooking}
            />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 p-6 text-sm text-zinc-500">
              Select a booking on the calendar or list to view full details.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs capitalize transition",
        active ? "bg-sun text-jungle" : "border border-white/15 text-zinc-300 hover:bg-white/5",
      )}
    >
      {label}
    </button>
  );
}

function BookingDetail({
  booking,
  onStatus,
  onDelete,
}: {
  booking: Booking;
  onStatus: (id: string, status: BookingStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-sun/30 bg-sun/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-sun">Booking detail</p>
          <h3 className="mt-1 font-display text-2xl text-white">{booking.name}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-sun">
          {booking.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-zinc-300">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-sun" />
          <a href={`mailto:${booking.email}`} className="hover:text-white">
            {booking.email}
          </a>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-sun" />
          <a href={`tel:${booking.phone}`} className="hover:text-white">
            {booking.phone}
          </a>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-sun" />
          {booking.startDate}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-sun" />
          {booking.travelers} travelers
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-sun" />
          {booking.pickup || "Pickup TBD"}
        </p>
        <p className="flex items-center gap-2">
          <Car className="h-4 w-4 text-sun" />
          {booking.vehicleId || "Any vehicle"} · {booking.tourTitle || "Custom"}
        </p>
      </div>

      {booking.message && (
        <p className="mt-4 rounded-2xl bg-black/30 p-3 text-sm text-zinc-300">
          {booking.message}
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-500">Submitted {formatDate(booking.createdAt)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatus(booking.id, status)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs capitalize",
              booking.status === status
                ? "border-sun bg-sun text-jungle"
                : "border-white/15 hover:bg-white/10",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <a
        href={whatsappLink(
          `Hi ${booking.name}! Regarding your Tripzo booking on ${booking.startDate}...`,
        )}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white"
      >
        Message on WhatsApp
      </a>

      <button
        type="button"
        onClick={() => onDelete(booking.id)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-400/10"
      >
        <Trash2 className="h-4 w-4" />
        Remove from calendar
      </button>
    </div>
  );
}
