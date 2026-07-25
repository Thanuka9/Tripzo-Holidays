"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Camera,
  Car,
  MapPinned,
  ArrowRight,
  MessageSquareHeart,
} from "lucide-react";
import type { Booking } from "@/lib/db";
import { BookingCalendar } from "@/components/admin/BookingCalendar";

type Stats = {
  bookings: number;
  newBookings: number;
  destinations: number;
  gallery: number;
  fleet: number;
  reviews: number;
  pendingReviews: number;
};

export default function AdminDashboardClient({
  initialBookings,
  stats,
}: {
  initialBookings: Booking[];
  stats: Stats;
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...bookings]
      .filter((b) => b.startDate >= today && b.status !== "cancelled")
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 6);
  }, [bookings]);

  const dayBookings = useMemo(() => {
    if (!selectedDate) return [];
    return bookings.filter((b) => b.startDate?.slice(0, 10) === selectedDate);
  }, [bookings, selectedDate]);

  const cards = [
    {
      label: "Bookings",
      value: stats.bookings,
      hint: `${stats.newBookings} new`,
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Reviews",
      value: stats.reviews,
      hint: `${stats.pendingReviews} pending`,
      href: "/admin/reviews",
      icon: MessageSquareHeart,
    },
    {
      label: "Images",
      value: stats.gallery,
      hint: "Hero, trips & gallery",
      href: "/admin/gallery",
      icon: Camera,
    },
    {
      label: "Destinations",
      value: stats.destinations,
      hint: "Places & photos",
      href: "/admin/destinations",
      icon: MapPinned,
    },
    {
      label: "Fleet",
      value: stats.fleet,
      hint: "Vehicles",
      href: "/admin/fleet",
      icon: Car,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-sun">Operations dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Calendar view of trips, booking details, and quick links to manage photos, places,
            and vehicles.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2.5 text-sm font-bold text-jungle"
        >
          Open bookings <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{card.label}</p>
              <card.icon className="h-4 w-4 text-sun" />
            </div>
            <p className="mt-2 font-display text-4xl text-white">{card.value}</p>
            <p className="mt-2 text-xs text-sun">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <BookingCalendar
          bookings={bookings}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSelectBooking={(b) => {
            setSelectedDate(b.startDate.slice(0, 10));
            router.push("/admin/bookings");
          }}
        />

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-display text-xl text-sun">
              {selectedDate ? `Trips on ${selectedDate}` : "Upcoming trips"}
            </h2>
            <div className="mt-4 space-y-3">
              {(selectedDate ? dayBookings : upcoming).length === 0 && (
                <p className="text-sm text-zinc-500">
                  {selectedDate
                    ? "No bookings on this day."
                    : "No upcoming bookings yet — new requests will appear here."}
                </p>
              )}
              {(selectedDate ? dayBookings : upcoming).map((b) => (
                <Link
                  key={b.id}
                  href="/admin/bookings"
                  className="block rounded-2xl border border-white/10 bg-black/20 p-3 hover:border-sun/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{b.name}</p>
                      <p className="text-xs text-zinc-400">
                        {b.startDate} · {b.tourTitle || "Custom"} · {b.travelers} guests
                      </p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-sun">
                      {b.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                title: "Approve guest reviews",
                text: "Publish feedback on the website",
                href: "/admin/reviews",
              },
              {
                title: "Manage images",
                text: "Hero slides, trip photos, reorder & replace",
                href: "/admin/gallery",
              },
              {
                title: "Add destination photos",
                text: "Sigiriya, Tooth Temple, beaches…",
                href: "/admin/destinations",
              },
              {
                title: "Update fleet photos",
                text: "Prius, KDH, Coaster, Rosa",
                href: "/admin/fleet",
              },
              {
                title: "Contact settings",
                text: "Phone, WhatsApp, email, Messenger",
                href: "/admin/settings",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-dashed border-sun/35 bg-sun/5 px-4 py-3 hover:bg-sun/10"
              >
                <p className="font-medium text-sun">{item.title}</p>
                <p className="text-xs text-zinc-400">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
