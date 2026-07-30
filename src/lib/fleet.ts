export type Vehicle = {
  id: string;
  name: string;
  description: string;
  capacity: string;
  idealFor: string;
  image: string;
  gallery?: string[];
  features: string[];
};

export const defaultFleet: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan / Hybrid Luxury",
    description:
      "Premium hybrid sedan travel for couples and small parties  -  ideal for airport runs, city transfers, and comfortable island touring with Chathura Bandara.",
    capacity: "1–3 passengers",
    idealFor: "Airport transfers & couples",
    image: "/images/fleet/sedan/sedan-1.jpg",
    gallery: [
      "/images/fleet/sedan/sedan-1.jpg",
      "/images/fleet/sedan/sedan-2.jpg",
      "/images/fleet/sedan/sedan-3.jpg",
      "/images/fleet/sedan/sedan-4.jpg",
    ],
    features: ["Air-conditioned", "Hybrid luxury", "Luggage space", "Airport ready"],
  },
  {
    id: "kdh",
    name: "Toyota KDH Van",
    description:
      "Spacious KDH vans for families and small groups  -  roomy seating, generous luggage space, and tour-ready comfort across multi-day Sri Lanka routes.",
    capacity: "6–10 passengers",
    idealFor: "Family tours & small groups",
    image: "/images/fleet/kdh/kdh-5.jpg",
    gallery: [
      "/images/fleet/kdh/kdh-5.jpg",
      "/images/fleet/kdh/kdh-1.jpg",
      "/images/fleet/kdh/kdh-2.jpg",
      "/images/fleet/kdh/kdh-3.jpg",
      "/images/fleet/kdh/kdh-4.jpg",
      "/images/fleet/kdh/kdh-6.jpg",
      "/images/fleet/kdh/kdh-7.jpg",
    ],
    features: ["Spacious cabin", "Tour-ready", "Ample luggage", "Air-conditioned"],
  },
  {
    id: "mini-coach",
    name: "Mini Coach",
    description:
      "Comfortable mini coach for medium groups  -  perfect for friends, office outings, and shared island adventures with room for everyone and their bags.",
    capacity: "12–20 passengers",
    idealFor: "Friends & office groups",
    image: "/images/fleet/mini-coach/mini-1.jpg",
    gallery: [
      "/images/fleet/mini-coach/mini-1.jpg",
      "/images/fleet/mini-coach/mini-2.jpg",
      "/images/fleet/mini-coach/mini-3.jpg",
      "/images/fleet/mini-coach/mini-4.jpg",
    ],
    features: ["Group seating", "Air-conditioned", "Long-distance ready"],
  },
  {
    id: "luxury-coach",
    name: "Luxury Bus",
    description:
      "High-capacity luxury coach for large families, wedding parties, and full tour groups  -  a safe, comfortable bubble on Sri Lanka’s roads.",
    capacity: "Up to 26+ passengers",
    idealFor: "Large groups & events",
    image: "/images/fleet/luxury-coach/luxury-5.jpg",
    gallery: [
      "/images/fleet/luxury-coach/luxury-5.jpg",
      "/images/fleet/luxury-coach/luxury-front.jpg",
      "/images/fleet/luxury-coach/luxury-1.jpg",
      "/images/fleet/luxury-coach/luxury-2.jpg",
      "/images/fleet/luxury-coach/luxury-3.jpg",
      "/images/fleet/luxury-coach/luxury-4.jpg",
    ],
    features: ["High capacity", "Luxury bus", "Group comfort", "Air-conditioned"],
  },
];
