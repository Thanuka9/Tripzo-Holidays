"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Booking, BookingStatus } from "@/lib/db";
import { cn } from "@/lib/utils";

const statusColor: Record<BookingStatus, string> = {
  new: "bg-sky-400",
  confirmed: "bg-emerald-400",
  completed: "bg-zinc-400",
  cancelled: "bg-rose-400",
};

type Props = {
  bookings: Booking[];
  selectedDate?: string | null;
  onSelectDate?: (isoDate: string | null) => void;
  onSelectBooking?: (booking: Booking) => void;
};

export function BookingCalendar({
  bookings,
  selectedDate,
  onSelectDate,
  onSelectBooking,
}: Props) {
  const [month, setMonth] = useState(() => {
    if (selectedDate) return startOfMonth(parseISO(selectedDate));
    return startOfMonth(new Date());
  });

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (!b.startDate) continue;
      const key = b.startDate.slice(0, 10);
      const list = map.get(key) || [];
      list.push(b);
      map.set(key, list);
    }
    return map;
  }, [bookings]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-xl text-sun">
          {format(month, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(startOfMonth(new Date()))}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-zinc-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = byDate.get(key) || [];
          const inMonth = isSameMonth(day, month);
          const selected = selectedDate === key;
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDate?.(selected ? null : key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDate?.(selected ? null : key);
                }
              }}
              className={cn(
                "min-h-[4.5rem] cursor-pointer rounded-2xl border p-1.5 text-left transition sm:min-h-[5.5rem]",
                inMonth
                  ? "border-white/10 bg-black/20 hover:border-sun/40"
                  : "border-transparent bg-transparent text-zinc-600",
                selected && "border-sun/70 bg-sun/10",
                isToday && !selected && "ring-1 ring-lagoon/60",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday && "bg-lagoon text-white",
                  !isToday && inMonth && "text-zinc-200",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayBookings.slice(0, 3).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBooking?.(b);
                      onSelectDate?.(key);
                    }}
                    className="flex w-full items-center gap-1 truncate rounded-md bg-white/5 px-1 py-0.5 text-[10px] text-zinc-200 hover:bg-white/10"
                    title={b.name}
                  >
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusColor[b.status])}
                    />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
                {dayBookings.length > 3 && (
                  <p className="px-1 text-[10px] text-zinc-500">
                    +{dayBookings.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        {(Object.keys(statusColor) as BookingStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 capitalize">
            <span className={cn("h-2 w-2 rounded-full", statusColor[s])} />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
