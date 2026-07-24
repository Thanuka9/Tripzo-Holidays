import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-jungle text-foam">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <BrandLogo href="/" onDark size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foam/80">
            {SITE.tagline} {SITE.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-sun">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-foam/85">
            <li>
              <Link href="/destinations" className="hover:text-sun">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/tours" className="hover:text-sun">
                Tour packages
              </Link>
            </li>
            <li>
              <Link href="/fleet" className="hover:text-sun">
                Our fleet
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-sun">
                Book a journey
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-sun">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-sun">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-sun">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-foam/85">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sun" />
              <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sun" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-sun" />
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                WhatsApp · {SITE.socialHandle}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sun" />
              <span>Serving travelers across Sri Lanka</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-foam/55">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
