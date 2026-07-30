import Link from "next/link";
import { MessageCircle, CalendarCheck, Car, Map } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Tell us your plan",
    text: "WhatsApp, call, or use the booking form with dates and group size.",
  },
  {
    icon: Map,
    title: "We craft the route",
    text: "Airport runs, day tours, or full island circuits  -  matched to your pace.",
  },
  {
    icon: Car,
    title: "Ride in comfort",
    text: "Clean Prius, KDH, or coach with a professional Tripzo driver.",
  },
  {
    icon: CalendarCheck,
    title: "Enjoy Sri Lanka",
    text: "Temples, tea hills, trains, safari, and beaches  -  we handle the road.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-foam px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagoon">
            Simple process
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-jungle sm:text-4xl">
            How Tripzo works
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <span className="font-display text-4xl text-lagoon/20">{String(i + 1).padStart(2, "0")}</span>
              <step.icon className="mt-2 h-6 w-6 text-lagoon" />
              <h3 className="mt-3 font-display text-xl text-jungle">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <Link
          href="/book"
          className="mt-10 inline-flex rounded-full bg-jungle px-5 py-3 text-sm font-semibold text-foam transition hover:bg-leaf"
        >
          Start your booking
        </Link>
      </div>
    </section>
  );
}
