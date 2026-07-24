"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const faqs = [
  {
    q: "Do you offer airport transfers?",
    a: "Yes — private airport pickup and drop anywhere in Sri Lanka, with flight tracking and meet-and-greet on request.",
  },
  {
    q: "Can you customize the 7-day tour?",
    a: "Absolutely. The classic circuit is a starting point — we adjust days, hotels pace, and optional stops around your interests.",
  },
  {
    q: "What vehicles do you have?",
    a: "Toyota Prius for small groups, KDH vans for families, and 26-seater Coaster / Rosa coaches for larger parties.",
  },
  {
    q: "How do I book or get a quote?",
    a: `Use the Book page, WhatsApp ${SITE.phoneDisplay}, or email ${SITE.email}. Share dates, travelers, and destinations — we reply quickly.`,
  },
  {
    q: "Where do team trip photos appear?",
    a: "When our cab team uploads photos with guests or at places, they show on the home page under “Real trip moments” and in Gallery → Our trips.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-mist/40 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
          FAQ
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-semibold text-jungle sm:text-4xl">
          Common questions
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-line bg-foam"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-jungle">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-lagoon transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
