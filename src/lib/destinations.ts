export type Destination = {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  /** Photo slideshow for this place (4–5 recommended) */
  gallery?: string[];
  featured?: boolean;
  slideshow?: boolean;
};

/**
 * Bump when seeded landmark photos change so stored destinations.json
 * refreshes galleries for built-in place IDs.
 */
export const DESTINATION_IMAGE_VERSION = 6;

export const defaultDestinations: Destination[] = [
  {
    id: "sigiriya",
    name: "Sigiriya",
    region: "Cultural Triangle",
    description:
      "Climb the iconic Lion Rock fortress and take in panoramic views across the ancient kingdom.",
    image: "/images/destinations/sigiriya-real-1.jpg",
    gallery: [
      "/images/destinations/sigiriya-real-1.jpg",
      "/images/destinations/hero-sigiriya.jpg",
      "/images/destinations/sigiriya-real-2.jpg",
      "/images/destinations/sigiriya-real-3.jpg",
      "/images/gallery/gallery-sigiriya-3.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "temple-of-the-tooth",
    name: "Temple of the Tooth",
    region: "Kandy",
    description:
      "Visit Sri Dalada Maligawa, the sacred Temple of the Tooth Relic in the hill capital.",
    image: "/images/destinations/tooth-real-1.jpg",
    gallery: [
      "/images/destinations/tooth-real-1.jpg",
      "/images/destinations/tooth-real-2.jpg",
      "/images/destinations/tooth-real-3.jpg",
      "/images/gallery/gallery-tooth-2.jpg",
      "/images/gallery/gallery-tooth-3.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    region: "Tea Country",
    description:
      "Walk misty tea estates, visit a premium factory, and enjoy cool highland air.",
    image: "/images/destinations/nuwara-eliya-real-1.jpg",
    gallery: [
      "/images/destinations/nuwara-eliya-real-1.jpg",
      "/images/destinations/nuwara-eliya-real-2.webp",
      "/images/destinations/nuwara-eliya-real-3.jpg",
      "/images/gallery/gallery-tea.jpg",
      "/images/gallery/gallery-tea-3.jpg",
      "/images/gallery/nuwara-gregory.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "ella",
    name: "Ella & Nine Arch Bridge",
    region: "Hill Country",
    description:
      "Ride the scenic train, photograph the Nine Arch Bridge, and trek Little Adam’s Peak.",
    image: "/images/destinations/ella-nine-arch-2.jpg",
    gallery: [
      "/images/destinations/ella-nine-arch-2.jpg",
      "/images/destinations/ella-nine-arch-train.jpg",
      "/images/destinations/ella-nine-arch.jpg",
      "/images/gallery/gallery-ella.jpg",
      "/images/destinations/hero-ella.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "mirissa",
    name: "Southern Beaches",
    region: "South Coast",
    description:
      "Golden-hour coastlines, coconut palms, and relaxed beach stops after safari days.",
    image: "/images/destinations/mirissa-2.jpg",
    gallery: [
      "/images/destinations/mirissa-2.jpg",
      "/images/destinations/mirissa-beach.jpg",
      "/images/destinations/unawatuna-2.jpg",
      "/images/gallery/unawatuna.jpg",
      "/images/gallery/gallery-beach.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "galle",
    name: "Galle Dutch Fort",
    region: "South Coast",
    description:
      "Sunset walks along UNESCO fort walls where ocean breeze meets colonial streets.",
    image: "/images/destinations/galle-fort-2.jpg",
    gallery: [
      "/images/destinations/galle-fort-2.jpg",
      "/images/destinations/galle-fort.jpg",
      "/images/gallery/gallery-galle.jpg",
      "/images/destinations/galle-fort-3.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "yala",
    name: "Yala National Park",
    region: "Wildlife",
    description:
      "Dawn jeep safari in search of leopards, elephants, and wild open plains.",
    image: "/images/destinations/yala-leopard.jpg",
    gallery: [
      "/images/destinations/yala-leopard.jpg",
      "/images/destinations/yala-elephant-2.jpg",
      "/images/destinations/yala.jpg",
      "/images/gallery/gallery-yala.jpg",
      "/images/gallery/udawalawe.jpg",
    ],
    featured: true,
    slideshow: true,
  },
  {
    id: "dambulla",
    name: "Dambulla Cave Temple",
    region: "Cultural Triangle",
    description:
      "Explore ancient cave shrines filled with Buddha statues and painted ceilings.",
    image: "/images/destinations/dambulla-2.jpg",
    gallery: [
      "/images/destinations/dambulla-2.jpg",
      "/images/destinations/dambulla.jpg",
      "/images/gallery/gallery-dambulla.jpg",
    ],
    featured: true,
  },
  {
    id: "pinnawala",
    name: "Pinnawala",
    region: "Central Province",
    description:
      "Meet gentle giants at the elephant orphanage on your arrival day route.",
    image: "/images/destinations/pinnawala-2.jpg",
    gallery: [
      "/images/destinations/pinnawala-2.jpg",
      "/images/destinations/pinnawala.jpg",
      "/images/gallery/gallery-pinnawala.jpg",
    ],
    featured: true,
  },
  {
    id: "kandy",
    name: "Kandy Lake & City",
    region: "Kandy",
    description:
      "Stroll the lakeside, catch a cultural dance, and feel the royal hill-city atmosphere.",
    image: "/images/destinations/kandy-lake-2.jpg",
    gallery: [
      "/images/destinations/kandy-lake-2.jpg",
      "/images/destinations/kandy-lake.jpg",
      "/images/gallery/gallery-kandy.jpg",
    ],
    featured: true,
  },
];

export const slideshowSlides = [
  {
    src: "/images/destinations/sigiriya-real-1.jpg",
    title: "Sigiriya Rock Fortress",
    caption: "Cultural Triangle · Ancient Sri Lanka",
  },
  {
    src: "/images/destinations/tooth-real-1.jpg",
    title: "Temple of the Tooth",
    caption: "Kandy · Sacred heritage",
  },
  {
    src: "/images/destinations/nuwara-eliya-real-1.jpg",
    title: "Nuwara Eliya Tea Country",
    caption: "Misty highlands · Factory tours",
  },
  {
    src: "/images/destinations/ella-nine-arch-2.jpg",
    title: "Ella Scenic Railway",
    caption: "Nine Arch Bridge · Hill country",
  },
  {
    src: "/images/destinations/yala-leopard.jpg",
    title: "Yala Wildlife Safari",
    caption: "Leopards · Elephants · Dawn drives",
  },
  {
    src: "/images/destinations/mirissa-2.jpg",
    title: "Southern Beaches",
    caption: "Palm coast · Golden sunsets",
  },
  {
    src: "/images/destinations/galle-fort-2.jpg",
    title: "Galle Dutch Fort",
    caption: "UNESCO · Ocean ramparts",
  },
];
