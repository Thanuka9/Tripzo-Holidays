"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useContact, useWhatsAppLink } from "@/components/SiteContactProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Places" },
  { href: "/fleet", label: "Fleet" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Pages with a dark full-bleed top — header overlays until scroll. */
function isHeroOverlayPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  if (pathname === "/gallery" || pathname === "/about" || pathname === "/reviews") {
    return true;
  }
  if (pathname.startsWith("/tours/")) return true;
  return false;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contact = useContact();
  const wa = useWhatsAppLink();
  const overlay = isHeroOverlayPath(pathname);
  // Frosted light bar once scrolled, menu open, or on light island pages
  const solid = scrolled || open || !overlay;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter,color] duration-500 ease-out",
          solid
            ? "border-b border-jungle/10 bg-foam/85 text-jungle shadow-sm shadow-jungle/10 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-jungle/65 via-jungle/30 to-transparent text-foam backdrop-blur-[1.5px]",
        )}
      >
        <div className="mx-auto flex h-[var(--site-header-height)] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <BrandLogo onDark={!solid} size="md" />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link relative rounded-full px-3 py-2 text-sm font-medium transition-all duration-300",
                    solid
                      ? active
                        ? "bg-lagoon/15 text-lagoon"
                        : "text-muted hover:bg-mist hover:text-jungle"
                      : active
                        ? "bg-sun/20 text-sun"
                        : "text-foam/85 hover:bg-white/10 hover:text-sun",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "nav-underline absolute bottom-1 left-3 right-3 h-0.5 origin-left rounded-full transition-transform duration-300",
                      solid ? "bg-lagoon" : "bg-sun",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${contact.phone}`}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                solid ? "text-jungle" : "text-foam/90 hover:text-sun",
              )}
            >
              <Phone className={cn("h-4 w-4", solid ? "text-lagoon" : "text-sun")} />
              <span className="hidden xl:inline">{contact.phoneDisplay}</span>
            </a>
            <Link
              href="/book"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300 hover:scale-[1.03] active:scale-95",
                solid
                  ? "bg-jungle text-foam hover:bg-leaf"
                  : "bg-sun text-jungle hover:bg-gold",
              )}
            >
              Book now
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full border transition duration-300 lg:hidden",
              solid
                ? "border-line text-jungle hover:bg-mist"
                : "border-foam/25 text-foam hover:bg-white/10",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t transition-all duration-300 lg:hidden",
            open ? "max-h-[32rem] opacity-100" : "max-h-0 border-transparent opacity-0",
            solid ? "border-line/80 bg-foam/95 backdrop-blur-xl" : "border-foam/10 bg-jungle",
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((link, i) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    "mobile-nav-item rounded-xl px-3 py-3 text-base font-medium transition",
                    solid
                      ? active
                        ? "bg-lagoon/10 text-lagoon"
                        : "text-jungle hover:bg-mist"
                      : active
                        ? "bg-sun/15 text-sun"
                        : "text-foam/85 hover:bg-white/10",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className={cn(
                "mt-2 rounded-full px-4 py-3 text-center text-sm font-semibold",
                solid ? "bg-jungle text-foam" : "bg-sun text-jungle",
              )}
            >
              Book now
            </Link>
            <a
              href={wa("Hi Tripzo! I would like to inquire about a tour.")}
              className="rounded-full bg-whatsapp px-4 py-3 text-center text-sm font-semibold text-white"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </header>

      {/* Reserve space on light pages so content isn't hidden under the fixed bar */}
      {!overlay && (
        <div
          aria-hidden
          className="shrink-0"
          style={{ height: "var(--site-header-height)" }}
        />
      )}
    </>
  );
}
