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

export const defaultDestinations: Destination[] = [
  {
    id: "sigiriya",
    name: "Sigiriya",
    region: "Cultural Triangle",
    description:
      "Climb the iconic Lion Rock fortress and take in panoramic views across the ancient kingdom.",
    image: "/images/destinations/hero-sigiriya.jpg",
    gallery: [
      "/images/destinations/hero-sigiriya.jpg",
      "/images/destinations/sigiriya-2.jpg",
      "/images/destinations/sigiriya-3.jpg",
      "/images/destinations/sigiriya.jpg",
      "/images/gallery/gallery-sigiriya.jpg",
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
    image: "/images/destinations/temple-2.jpg",
    gallery: [
      "/images/destinations/temple-2.jpg",
      "/images/destinations/temple-of-the-tooth.jpg",
      "/images/gallery/gallery-tooth.jpg",
      "/images/destinations/kandy-2.jpg",
      "/images/gallery/gallery-kandy.jpg",
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
    image: "/images/gallery/gallery-tea.jpg",
    gallery: [
      "/images/gallery/gallery-tea.jpg",
      "/images/destinations/nuwara-eliya.jpg",
      "/images/gallery/tea-picker.jpg",
      "/images/gallery/horton.jpg",
      "/images/gallery/mist-hills.jpg",
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
    image: "/images/destinations/hero-ella.jpg",
    gallery: [
      "/images/destinations/hero-ella.jpg",
      "/images/destinations/ella-nine-arch.jpg",
      "/images/gallery/gallery-ella.jpg",
      "/images/destinations/train-2.jpg",
      "/images/gallery/train-hills.jpg",
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
    image: "/images/destinations/beach-2.jpg",
    gallery: [
      "/images/destinations/beach-2.jpg",
      "/images/destinations/mirissa-beach.jpg",
      "/images/gallery/gallery-beach.jpg",
      "/images/gallery/unawatuna.jpg",
      "/images/gallery/whale.jpg",
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
    image: "/images/destinations/fort-2.jpg",
    gallery: [
      "/images/destinations/fort-2.jpg",
      "/images/destinations/galle-fort.jpg",
      "/images/gallery/gallery-galle.jpg",
      "/images/gallery/stilt-fishermen.jpg",
      "/images/gallery/unawatuna.jpg",
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
    image: "/images/destinations/wildlife-2.jpg",
    gallery: [
      "/images/destinations/wildlife-2.jpg",
      "/images/destinations/yala.jpg",
      "/images/gallery/gallery-yala.jpg",
      "/images/gallery/udawalawe.jpg",
      "/images/gallery/gallery-pinnawala.jpg",
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
    image: "/images/destinations/dambulla.jpg",
    gallery: [
      "/images/destinations/dambulla.jpg",
      "/images/gallery/gallery-dambulla.jpg",
      "/images/gallery/polonnaruwa.jpg",
      "/images/gallery/anuradhapura.jpg",
      "/images/destinations/sigiriya-2.jpg",
    ],
    featured: true,
  },
  {
    id: "pinnawala",
    name: "Pinnawala",
    region: "Central Province",
    description:
      "Meet gentle giants at the elephant orphanage on your arrival day route.",
    image: "/images/destinations/pinnawala.jpg",
    gallery: [
      "/images/destinations/pinnawala.jpg",
      "/images/gallery/gallery-pinnawala.jpg",
      "/images/gallery/udawalawe.jpg",
      "/images/destinations/wildlife-2.jpg",
      "/images/gallery/gallery-yala.jpg",
    ],
    featured: true,
  },
  {
    id: "kandy",
    name: "Kandy Lake & City",
    region: "Kandy",
    description:
      "Stroll the lakeside, catch a cultural dance, and feel the royal hill-city atmosphere.",
    image: "/images/destinations/kandy-2.jpg",
    gallery: [
      "/images/destinations/kandy-2.jpg",
      "/images/destinations/kandy-lake.jpg",
      "/images/gallery/gallery-kandy.jpg",
      "/images/destinations/temple-2.jpg",
      "/images/gallery/gallery-tooth.jpg",
    ],
    featured: true,
  },
];

export const slideshowSlides = [
  {
    src: "/images/destinations/hero-sigiriya.jpg",
    title: "Sigiriya Rock Fortress",
    caption: "Cultural Triangle · Ancient Sri Lanka",
  },
  {
    src: "/images/destinations/temple-2.jpg",
    title: "Temple of the Tooth",
    caption: "Kandy · Sacred heritage",
  },
  {
    src: "/images/gallery/gallery-tea.jpg",
    title: "Nuwara Eliya Tea Country",
    caption: "Misty highlands · Factory tours",
  },
  {
    src: "/images/destinations/hero-ella.jpg",
    title: "Ella Scenic Railway",
    caption: "Nine Arch Bridge · Hill country",
  },
  {
    src: "/images/destinations/wildlife-2.jpg",
    title: "Yala Wildlife Safari",
    caption: "Leopards · Elephants · Dawn drives",
  },
  {
    src: "/images/destinations/beach-2.jpg",
    title: "Southern Beaches",
    caption: "Palm coast · Golden sunsets",
  },
  {
    src: "/images/destinations/fort-2.jpg",
    title: "Galle Dutch Fort",
    caption: "UNESCO · Ocean ramparts",
  },
];
