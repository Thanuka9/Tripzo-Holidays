export type Destination = {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
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
    image: "/images/destinations/sigiriya.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "temple-of-the-tooth",
    name: "Temple of the Tooth",
    region: "Kandy",
    description:
      "Visit Sri Dalada Maligawa, the sacred Temple of the Tooth Relic in the hill capital.",
    image: "/images/destinations/temple-of-the-tooth.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    region: "Tea Country",
    description:
      "Walk misty tea estates, visit a premium factory, and enjoy cool highland air.",
    image: "/images/destinations/nuwara-eliya.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "ella",
    name: "Ella & Nine Arch Bridge",
    region: "Hill Country",
    description:
      "Ride the scenic train, photograph the Nine Arch Bridge, and trek Little Adam’s Peak.",
    image: "/images/destinations/ella-nine-arch.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "mirissa",
    name: "Southern Beaches",
    region: "South Coast",
    description:
      "Golden-hour coastlines, coconut palms, and relaxed beach stops after safari days.",
    image: "/images/destinations/mirissa-beach.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "galle",
    name: "Galle Dutch Fort",
    region: "South Coast",
    description:
      "Sunset walks along UNESCO fort walls where ocean breeze meets colonial streets.",
    image: "/images/destinations/galle-fort.jpg",
    featured: true,
    slideshow: true,
  },
  {
    id: "yala",
    name: "Yala National Park",
    region: "Wildlife",
    description:
      "Dawn jeep safari in search of leopards, elephants, and wild open plains.",
    image: "/images/destinations/yala.jpg",
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
    featured: true,
  },
  {
    id: "pinnawala",
    name: "Pinnawala",
    region: "Central Province",
    description:
      "Meet gentle giants at the elephant orphanage on your arrival day route.",
    image: "/images/destinations/pinnawala.jpg",
    featured: true,
  },
  {
    id: "kandy",
    name: "Kandy Lake & City",
    region: "Kandy",
    description:
      "Stroll the lakeside, catch a cultural dance, and feel the royal hill-city atmosphere.",
    image: "/images/destinations/kandy-lake.jpg",
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
    src: "/images/destinations/temple-of-the-tooth.jpg",
    title: "Temple of the Tooth",
    caption: "Kandy · Sacred heritage",
  },
  {
    src: "/images/destinations/nuwara-eliya.jpg",
    title: "Nuwara Eliya Tea Country",
    caption: "Misty highlands · Factory tours",
  },
  {
    src: "/images/destinations/hero-ella.jpg",
    title: "Ella Scenic Railway",
    caption: "Nine Arch Bridge · Hill country",
  },
  {
    src: "/images/destinations/yala.jpg",
    title: "Yala Wildlife Safari",
    caption: "Leopards · Elephants · Dawn drives",
  },
  {
    src: "/images/destinations/mirissa-beach.jpg",
    title: "Southern Beaches",
    caption: "Palm coast · Golden sunsets",
  },
  {
    src: "/images/destinations/galle-fort.jpg",
    title: "Galle Dutch Fort",
    caption: "UNESCO · Ocean ramparts",
  },
];
