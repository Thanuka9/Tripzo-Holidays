"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink(
        "Hi Tripzo Cabs & Tours! I'd like to book a ride or tour in Sri Lanka.",
      )}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="wa-pulse fixed right-4 z-50 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-3.5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 sm:right-5 sm:px-4"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
