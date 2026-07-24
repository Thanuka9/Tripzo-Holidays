export const SITE = {
  name: "Tripzo Cabs & Tours",
  shortName: "Tripzo",
  brandHolidays: "Tripzo Holidays",
  tagline: "Reliable transport for locals and tourists across Sri Lanka.",
  description:
    "From daily rides to dream tours, we make every journey smooth, safe, and unforgettable.",
  phone: process.env.NEXT_PUBLIC_PHONE || "+94766493348",
  phoneDisplay: "076 649 3348",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "94766493348",
  email: process.env.NEXT_PUBLIC_EMAIL || "chathurasamarakoon9@gmail.com",
  messenger:
    process.env.NEXT_PUBLIC_MESSENGER || "https://m.me/TripzoHolidays",
  socialHandle: "Tripzo Holidays",
  location: "Sri Lanka",
  googleMapsReviews:
    "https://www.google.com/maps?cid=6571512934601178773",
  chauffeur: "Chathura Bandara",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
