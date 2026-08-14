import Link from "next/link";
import { SiteImage as Image } from "@/components/SiteImage";
import {
  ArrowRight,
  Car,
  Compass,
  ShieldCheck,
  Sparkles,
  Clock3,
} from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import {
  getFleet,
  getDestinations,
  getApprovedReviews,
  getTeamPhotos,
  getHeroSlides,
  getContactSettings,
  getTours,
} from "@/lib/db";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { DestinationsGrid } from "@/components/DestinationsGrid";
import { ReviewsSection } from "@/components/ReviewsSection";
import { TeamTripsSection } from "@/components/TeamTripsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/FaqSection";

export const dynamic = "force-dynamic";

const reasons = [
  {
    icon: Compass,
    title: "Island-wide tours",
    text: "From cultural capitals to tea hills, wildlife, and southern beaches.",
  },
  {
    icon: Car,
    title: "Comfortable fleet",
    text: "Prius, KDH vans, and 26-seater coaches  -  matched to your group size.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & reliable",
    text: "Professional drivers, clean vehicles, and punctual airport transfers.",
  },
  {
    icon: Clock3,
    title: "Always reachable",
    text: "WhatsApp, call, or Messenger  -  we plan journeys around your timing.",
  },
];

export default async function HomePage() {
  const [fleet, destinations, reviews, teamPhotos, heroSlides, contact, allTours] =
    await Promise.all([
      getFleet(),
      getDestinations(),
      getApprovedReviews(),
      getTeamPhotos(),
      getHeroSlides(),
      getContactSettings(),
      getTours(),
    ]);
  const featured = allTours.filter((t) => t.featured).slice(0, 3);
  const featuredPlaces = destinations.filter((d) => d.featured).slice(0, 6);

  return (
    <div>
      <HeroSlideshow slides={heroSlides} />

      <DestinationsGrid destinations={featuredPlaces} />

      <HowItWorks />

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
              Why Tripzo
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl text-balance">
              Transport you can trust. Tours you will remember.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((item, i) => (
              <div
                key={item.title}
                className="reveal rounded-3xl border border-line bg-foam/80 p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <item.icon className="h-6 w-6 text-lagoon" />
                <h3 className="mt-4 font-display text-xl text-jungle">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
                Featured packages
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl">
                Journeys crafted for Sri Lanka
              </h2>
            </div>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-sm font-semibold text-leaf"
            >
              View all tours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featured.map((tour) => (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-line bg-foam shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jungle/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-foam/95 px-3 py-1 text-xs font-semibold text-jungle">
                    {tour.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl text-jungle">{tour.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{tour.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-jungle px-4 py-20 text-foam sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sun">
              Signature route
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl text-balance">
              Premium 7-day Sri Lanka circuit
            </h2>
            <p className="mt-4 text-foam/80 leading-relaxed">
              Airport to Sigiriya, Kandy, tea country, the scenic Ella train, Yala safari,
              and Galle Fort  -  then a smooth Southern Expressway transfer home.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foam/85">
              {[
                "Pinnawala & Sigiriya Rock",
                "Temple of the Tooth & tea factories",
                "Nanu Oya → Ella scenic railway",
                "Yala dawn safari & Galle sunset",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sun" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tours/seven-days-sri-lanka"
                className="rounded-full bg-sun px-5 py-3 text-sm font-bold text-jungle"
              >
                See full itinerary
              </Link>
              <a
                href={whatsappLink(
                  "Hi Tripzo! I'm interested in the 7-Day Sri Lanka Tour Package.",
                  contact.whatsapp,
                )}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-foam/30 px-5 py-3 text-sm font-semibold"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="float-soft overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-3">
              <Image
                src="/images/route-map-v2.png"
                alt="Tripzo Holidays Premium 7-Day Sri Lanka Route Map"
                width={912}
                height={498}
                className="h-auto w-full rounded-[1.25rem] object-contain bg-foam"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-island px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
                Our fleet
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl">
                Ride in comfort
              </h2>
            </div>
            <Link href="/fleet" className="text-sm font-semibold text-leaf">
              View fleet →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fleet.map((v) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-3xl border border-line bg-foam"
              >
                <div className="relative aspect-[5/4]">
                  <Image src={v.image} alt={v.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-jungle">{v.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-lagoon">
                    {v.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamTripsSection photos={teamPhotos} />

      <ReviewsSection reviews={reviews} />

      <FaqSection />

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf to-lagoon px-6 py-14 text-center text-foam sm:px-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl text-balance">
            Ready for your next Sri Lanka adventure?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foam/85">
            Tell us your dates, group size, and dream destinations  -  we will craft the route
            and send a clear quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/book"
              className="rounded-full bg-foam px-6 py-3 text-sm font-bold text-jungle"
            >
              Start booking
            </Link>
            <a
              href={`tel:${contact.phone}`}
              className="rounded-full border border-foam/40 px-6 py-3 text-sm font-semibold"
            >
              Call {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
