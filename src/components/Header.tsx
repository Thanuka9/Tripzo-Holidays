"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE, whatsappLink } from "@/lib/constants";
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

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-jungle/10 bg-jungle/95 text-foam shadow-lg shadow-jungle/20 backdrop-blur-xl"
          : "border-b border-line/60 bg-foam/90 text-jungle backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <BrandLogo onDark={scrolled} size="md" />

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
                  scrolled
                    ? active
                      ? "bg-sun/20 text-sun"
                      : "text-foam/80 hover:bg-white/10 hover:text-sun"
                    : active
                      ? "bg-lagoon/15 text-lagoon"
                      : "text-muted hover:bg-mist hover:text-jungle",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "nav-underline absolute bottom-1 left-3 right-3 h-0.5 origin-left rounded-full transition-transform duration-300",
                    scrolled ? "bg-sun" : "bg-lagoon",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${SITE.phone}`}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-colors",
              scrolled ? "text-foam/90 hover:text-sun" : "text-jungle",
            )}
          >
            <Phone className={cn("h-4 w-4", scrolled ? "text-sun" : "text-lagoon")} />
            <span className="hidden xl:inline">{SITE.phoneDisplay}</span>
          </a>
          <Link
            href="/book"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition duration-300 hover:scale-[1.03] active:scale-95",
              scrolled
                ? "bg-sun text-jungle hover:bg-gold"
                : "bg-jungle text-foam hover:bg-leaf",
            )}
          >
            Book now
          </Link>
        </div>

        <button
          type="button"
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full border transition lg:hidden",
            scrolled
              ? "border-foam/25 text-foam hover:bg-white/10"
              : "border-line text-jungle hover:bg-mist",
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
          scrolled ? "border-foam/10 bg-jungle" : "border-line bg-foam",
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
                  scrolled
                    ? active
                      ? "bg-sun/15 text-sun"
                      : "text-foam/85 hover:bg-white/10"
                    : active
                      ? "bg-lagoon/10 text-lagoon"
                      : "text-jungle hover:bg-mist",
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
              scrolled ? "bg-sun text-jungle" : "bg-jungle text-foam",
            )}
          >
            Book now
          </Link>
          <a
            href={whatsappLink("Hi Tripzo! I would like to inquire about a tour.")}
            className="rounded-full bg-whatsapp px-4 py-3 text-center text-sm font-semibold text-white"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </header>
  );
}
