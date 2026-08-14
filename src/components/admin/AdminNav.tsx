"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Camera,
  Car,
  LayoutDashboard,
  MapPinned,
  Menu,
  MessageSquareHeart,
  Route,
  Settings,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/tours", label: "Tours", icon: Route },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareHeart },
  { href: "/admin/destinations", label: "Destinations", icon: MapPinned },
  { href: "/admin/gallery", label: "Images", icon: Camera },
  { href: "/admin/fleet", label: "Fleet", icon: Car },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({
  onLogout,
  siteUrl,
}: {
  onLogout: () => Promise<void>;
  siteUrl: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/10 bg-[#0f1412]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo href="/admin" onDark size="sm" />
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-sun sm:text-xl">
              Admin
            </p>
            <p className="hidden truncate text-[11px] text-zinc-500 sm:block">
              Tripzo Holidays control panel
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href, link.exact);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition",
                  active
                    ? "bg-sun text-jungle"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5 sm:inline-flex"
          >
            View site
          </Link>
          <form action={onLogout} className="hidden sm:block">
            <button
              type="submit"
              className="rounded-full border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              Log out
            </button>
          </form>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-zinc-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle admin menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0f1412] px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active = isActive(link.href, link.exact);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm",
                    active
                      ? "bg-sun/15 text-sun"
                      : "text-zinc-300 hover:bg-white/5",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
            <Link
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-white/15 px-3 py-2 text-center text-sm"
            >
              View site
            </Link>
            <form action={onLogout} className="flex-1">
              <button
                type="submit"
                className="w-full rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
