import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Tripzo Cabs & Tours by phone, WhatsApp, email, or Messenger.",
};

export default function ContactPage() {
  return (
    <div className="bg-island">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
          Get in touch
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-jungle sm:text-5xl">
          Contact Tripzo
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Planning a transfer or a multi-day tour? Reach out anytime — we reply quickly on
          WhatsApp and phone.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <a
            href={`tel:${SITE.phone}`}
            className="rounded-3xl border border-line bg-foam p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Phone className="h-6 w-6 text-lagoon" />
            <h2 className="mt-4 font-display text-xl text-jungle">Phone</h2>
            <p className="mt-2 text-sm text-muted">{SITE.phoneDisplay}</p>
          </a>
          <a
            href={whatsappLink("Hi Tripzo Holidays!")}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-line bg-foam p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <MessageCircle className="h-6 w-6 text-whatsapp" />
            <h2 className="mt-4 font-display text-xl text-jungle">WhatsApp / Messenger</h2>
            <p className="mt-2 text-sm text-muted">{SITE.socialHandle}</p>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-3xl border border-line bg-foam p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Mail className="h-6 w-6 text-lagoon" />
            <h2 className="mt-4 font-display text-xl text-jungle">Email</h2>
            <p className="mt-2 break-all text-sm text-muted">{SITE.email}</p>
          </a>
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-line bg-foam p-6 sm:p-8">
          <h2 className="font-display text-2xl text-jungle">Book your unforgettable journey</h2>
          <p className="mt-2 text-sm text-muted">
            Prefer a structured request? Use our booking form and we will confirm details.
          </p>
          <a
            href="/book"
            className="mt-5 inline-flex rounded-full bg-jungle px-5 py-3 text-sm font-semibold text-foam"
          >
            Go to booking
          </a>
        </div>
      </div>
    </div>
  );
}
