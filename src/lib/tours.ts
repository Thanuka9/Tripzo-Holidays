export type TourDay = {
  day: number;
  title: string;
  description: string;
  highlights: string[];
};

export type Tour = {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  days: number;
  priceFrom?: string;
  category: "tour" | "day" | "transfer";
  image: string;
  summary: string;
  highlights: string[];
  itinerary?: TourDay[];
  featured?: boolean;
  pdfUrl?: string;
};

export const tours: Tour[] = [
  {
    slug: "seven-days-sri-lanka",
    title: "Seven Days Sri Lanka Tour Package",
    subtitle: "How the 7-Day Route is Crafted",
    duration: "7 Days / 6 Nights",
    days: 7,
    priceFrom: "Custom quote",
    category: "tour",
    featured: true,
    pdfUrl: "/Packages/Tripzo_Holidays_Premium_7_Day_Sri_Lanka_Itinerary_260615_205347.pdf",
    image: "/images/destinations/hero-sigiriya.jpg",
    summary:
      "A carefully crafted premium week across Sri Lanka — from Pinnawala and Sigiriya to Kandy, the alpine train, Ella, Yala safari, and Galle Fort — ending with a smooth Southern Expressway airport transfer. Chauffeur guide: Chathura Bandara.",
    highlights: [
      "Pinnawala elephant viewing",
      "Sigiriya Rock Fortress",
      "Temple of the Tooth Relic",
      "Nanu Oya → Ella scenic train",
      "Yala dawn safari",
      "Galle Dutch Fort sunset",
    ],
    itinerary: [
      {
        day: 1,
        title: "Airport → Pinnawala → Sigiriya",
        description:
          "Smooth arrival, elephant viewing at Pinnawala, and a relaxing check-in at Sigiriya.",
        highlights: ["Smooth arrival", "Pinnawala", "Sigiriya check-in"],
      },
      {
        day: 2,
        title: "Sigiriya → Matale → Kandy",
        description:
          "Morning climb of the iconic Sigiriya Rock Fortress, a private educational stroll through a Matale Spice Garden, and arrival in the royal hill capital of Kandy.",
        highlights: ["Sigiriya Rock Fortress", "Matale Spice Garden", "Kandy"],
      },
      {
        day: 3,
        title: "Kandy → Ramboda → Nuwara Eliya",
        description:
          "Morning visit to the Temple of the Tooth Relic, climbing through the tea mountains past Ramboda Falls, a premium tea factory tour, and an evening stroll by Gregory Lake.",
        highlights: [
          "Temple of the Tooth Relic",
          "Ramboda Falls",
          "Tea factory",
          "Gregory Lake",
        ],
      },
      {
        day: 4,
        title: "Nanu Oya → Ella (Scenic Train)",
        description:
          "The absolute highlight of the alpine railway — guests take the scenic train from Nanu Oya to Ella, while you seamlessly transport their heavy luggage in the luxury vehicle.",
        highlights: ["Scenic train", "Luggage by luxury vehicle", "Ella"],
      },
      {
        day: 5,
        title: "Ella → Yala",
        description:
          "Iconic photography at the Nine Arch Bridge, trekking up Little Adam's Peak, driving past Ravana Falls, and checking into a wild safari resort in Yala.",
        highlights: [
          "Nine Arch Bridge",
          "Little Adam's Peak",
          "Ravana Falls",
          "Yala resort",
        ],
      },
      {
        day: 6,
        title: "Yala Safari → Galle",
        description:
          "A dawn 4x4 Jeep Safari in Yala National Park to search for leopards and wild elephants, followed by a scenic coastal drive to watch the golden-hour sunset over the UNESCO World Heritage Galle Dutch Fort.",
        highlights: ["Yala Jeep Safari", "Coastal drive", "Galle Dutch Fort"],
      },
      {
        day: 7,
        title: "Coast → Airport",
        description:
          "A relaxed breakfast by the coast, followed by a completely traffic-free transfer straight back to the airport via the Southern Expressway.",
        highlights: ["Coastal breakfast", "Southern Expressway", "Airport"],
      },
    ],
  },
  {
    slug: "ten-days-sri-lanka",
    title: "Signature Sri Lanka Route",
    subtitle: "Premium 10-day curated journey",
    duration: "10 Days / 9 Nights",
    days: 10,
    priceFrom: "Custom quote",
    category: "tour",
    featured: true,
    pdfUrl: "/Packages/Tripzo_Holidays_Premium_10_Day_Sri_Lanka_Itinerary_260615_205452.pdf",
    image: "/images/destinations/hero-ella.jpg",
    summary:
      "The definitive Sri Lankan journey — ancient fortresses, misty tea hills, alpine trains, leopard country, Mirissa beaches, and colonial Galle. Seamless luxury transport with Chathura Bandara.",
    highlights: [
      "Sigiriya & Dambulla",
      "Kandy cultural show",
      "Scenic train to Ella",
      "Full Ella exploration day",
      "Yala + Mirissa coast",
      "Galle Fort sunset",
    ],
    itinerary: [
      {
        day: 1,
        title: "Airport → Pinnawala → Sigiriya",
        description:
          "Luxury welcome at BIA. Travel to the Cultural Triangle with a Pinnawala elephant stop. Premium Sigiriya resort overnight.",
        highlights: ["VIP pickup", "Pinnawala", "Sigiriya"],
      },
      {
        day: 2,
        title: "Sigiriya & Dambulla (or Minneriya)",
        description:
          "Early UNESCO Sigiriya climb. Afternoon Dambulla Cave Temple — or optional Minneriya elephant safari.",
        highlights: ["Sigiriya", "Dambulla / Minneriya"],
      },
      {
        day: 3,
        title: "Matale → Kandy",
        description:
          "Matale Spice Garden, Kandy cultural dance show, and Temple of the Tooth during evening offerings.",
        highlights: ["Spice Garden", "Cultural show", "Temple of the Tooth"],
      },
      {
        day: 4,
        title: "Kandy → Nuwara Eliya",
        description:
          "Ramboda Falls, heritage tea factory with tasting, evening stroll at Gregory Lake.",
        highlights: ["Ramboda Falls", "Tea factory", "Gregory Lake"],
      },
      {
        day: 5,
        title: "Nanu Oya → Ella train",
        description:
          "Hands-free scenic train with luggage by private car. Welcome at Ella station and cafe culture evening.",
        highlights: ["Alpine train", "Luggage transfer", "Ella"],
      },
      {
        day: 6,
        title: "Explore Ella",
        description:
          "Nine Arch Bridge and Little Adam’s Peak trek with panoramic Ella Gap views.",
        highlights: ["Nine Arch Bridge", "Little Adam’s Peak"],
      },
      {
        day: 7,
        title: "Ella → Yala",
        description:
          "Ravana Falls and Wellawaya pass into Yala. Check into a premium wildlife wilderness resort.",
        highlights: ["Ravana Falls", "Yala resort"],
      },
      {
        day: 8,
        title: "Yala Safari → Mirissa",
        description:
          "Dawn private 4x4 safari, then coastal highway to Mirissa beach resort.",
        highlights: ["Yala safari", "Mirissa beach"],
      },
      {
        day: 9,
        title: "Mirissa → Galle",
        description:
          "Coconut Tree Hill, Weligama stilt fishermen, and golden-hour sunset at Galle Dutch Fort.",
        highlights: ["Coconut Tree Hill", "Stilt fishermen", "Galle Fort"],
      },
      {
        day: 10,
        title: "Expressway → Airport",
        description:
          "Ocean breakfast, then Southern Expressway corridor straight to BIA — stress-free departure.",
        highlights: ["Expressway", "Airport"],
      },
    ],
  },
  {
    slug: "fifteen-days-sri-lanka",
    title: "Grand Sri Lanka Experience",
    subtitle: "Premium 15-day immersive itinerary",
    duration: "15 Days / 14 Nights",
    days: 15,
    priceFrom: "Custom quote",
    category: "tour",
    featured: true,
    pdfUrl: "/Packages/Tripzo_Holidays_Premium_15_Day_Sri_Lanka_Itinerary_260615_205054.pdf",
    image: "/images/destinations/mirissa-beach.jpg",
    summary:
      "Our deepest island immersion — Cultural Triangle, Horton Plains World’s End, Ella, Yala, Mirissa, optional whales, Galle, Hikkaduwa, and Bentota Madu Ganga. Absolute comfort and flawless pacing.",
    highlights: [
      "Minneriya elephant gathering",
      "Horton Plains World’s End",
      "Scenic train + Ella",
      "Yala & Mirissa",
      "Optional whale watching",
      "Bentota & Madu Ganga",
    ],
    itinerary: [
      {
        day: 1,
        title: "Airport → Pinnawala → Sigiriya",
        description:
          "Welcome at BIA, Pinnawala elephants, premium Sigiriya resort.",
        highlights: ["Airport", "Pinnawala", "Sigiriya"],
      },
      {
        day: 2,
        title: "Sigiriya & Minneriya Safari",
        description:
          "Early Sigiriya climb, afternoon private Jeep safari at Minneriya for The Gathering.",
        highlights: ["Sigiriya", "Minneriya safari"],
      },
      {
        day: 3,
        title: "Dambulla → Matale → Kandy",
        description:
          "Dambulla Golden Cave Temple, Matale Spice Garden, Kandy lakeside evening.",
        highlights: ["Dambulla", "Spice Garden", "Kandy"],
      },
      {
        day: 4,
        title: "Kandy city & culture",
        description:
          "Peradeniya Botanical Gardens, Temple of the Tooth evening offerings, Kandyan dance.",
        highlights: ["Botanical Gardens", "Temple", "Cultural dance"],
      },
      {
        day: 5,
        title: "Kandy → Nuwara Eliya",
        description:
          "Ramboda Falls, heritage tea factory tasting, Gregory Lake stroll.",
        highlights: ["Ramboda", "Tea factory", "Gregory Lake"],
      },
      {
        day: 6,
        title: "Horton Plains World’s End",
        description:
          "Dawn trek through cloud forest to World’s End precipice, cozy Little England evening.",
        highlights: ["Horton Plains", "World’s End"],
      },
      {
        day: 7,
        title: "Train to Ella",
        description:
          "Nanu Oya scenic train with luggage by car; Ella cafe culture evening.",
        highlights: ["Scenic train", "Ella"],
      },
      {
        day: 8,
        title: "Ella highlights",
        description:
          "Nine Arch Bridge and Little Adam’s Peak with Ella Gap views.",
        highlights: ["Nine Arch", "Little Adam’s Peak"],
      },
      {
        day: 9,
        title: "Ella → Yala",
        description:
          "Ravana Falls, Wellawaya, luxury safari resort under the stars.",
        highlights: ["Ravana Falls", "Yala"],
      },
      {
        day: 10,
        title: "Yala Safari → Mirissa",
        description:
          "Dawn leopard safari, then coastal drive via Tangalle to Mirissa.",
        highlights: ["Yala safari", "Mirissa"],
      },
      {
        day: 11,
        title: "Mirissa beach day",
        description:
          "Coconut Tree Hill photos and leisure on Mirissa sands — seafood, surf, or rest.",
        highlights: ["Coconut Tree Hill", "Beach leisure"],
      },
      {
        day: 12,
        title: "Whales (optional) → Galle",
        description:
          "Optional dawn whale cruise, Weligama stilt fishermen, Galle Fort sunset.",
        highlights: ["Whale watching", "Galle Fort"],
      },
      {
        day: 13,
        title: "Galle → Hikkaduwa → Bentota",
        description:
          "West coast drive, Hikkaduwa coral/turtle hatchery stop, Bentota luxury beach resort.",
        highlights: ["Hikkaduwa", "Bentota"],
      },
      {
        day: 14,
        title: "Madu Ganga & Bentota",
        description:
          "Madu Ganga mangrove boat safari and cinnamon island; final beach leisure.",
        highlights: ["Madu Ganga", "Beach luxury"],
      },
      {
        day: 15,
        title: "Bentota → Airport",
        description:
          "Final breakfast, Southern Expressway to BIA — relaxed, perfectly timed departure.",
        highlights: ["Expressway", "Airport"],
      },
    ],
  },
  {
    slug: "airport-transfer",
    title: "Airport Pickup & Drop",
    subtitle: "Stress-free arrivals",
    duration: "On demand",
    days: 1,
    category: "transfer",
    image: "/images/fleet/sedan/sedan-2.jpg",
    summary:
      "Reliable airport transfers with professional drivers, clean vehicles, and on-time service — perfect for a calm arrival or departure anywhere in Sri Lanka.",
    highlights: ["Meet & greet", "Flight tracking", "Private vehicle", "24/7 availability"],
  },
  {
    slug: "kandy-city-tour",
    title: "Kandy City Tour",
    subtitle: "Cultural heart of the island",
    duration: "1 Day",
    days: 1,
    category: "day",
    image: "/images/destinations/temple-of-the-tooth.jpg",
    summary:
      "Visit the sacred Temple of the Tooth Relic, enjoy panoramic viewpoints, explore tea and spice heritage, and end with a vibrant cultural dance performance.",
    highlights: ["Temple of the Tooth", "Viewpoints", "Cultural show", "Local markets"],
  },
  {
    slug: "sigiriya-day-tour",
    title: "Sigiriya & Cultural Triangle",
    subtitle: "One-day heritage escape",
    duration: "1 Day",
    days: 1,
    category: "day",
    image: "/images/destinations/sigiriya.jpg",
    summary:
      "Climb Sigiriya Rock, explore Dambulla Cave Temple, and optionally add a Minneriya wildlife safari — all in one unforgettable day.",
    highlights: ["Sigiriya Rock", "Dambulla Caves", "Optional safari", "Private guide driver"],
  },
];

export function getTour(slug: string) {
  return tours.find((t) => t.slug === slug);
}

export function getFeaturedTours() {
  return tours.filter((t) => t.featured).slice(0, 3);
}
