export type GalleryCategory =
  | "heritage"
  | "hills"
  | "wildlife"
  | "beach"
  | "journey"
  | "trips";

export type ShowcaseImage = {
  id: string;
  src: string;
  title: string;
  category: GalleryCategory;
  span?: "tall" | "wide" | "normal";
};

/** Curated Sri Lanka showcase. Multiple photos per place open in the lightbox slideshow. */
export const showcaseGallery: ShowcaseImage[] = [
  // Sigiriya (multiple)
  {
    id: "sg-sigiriya",
    src: "/images/gallery/gallery-sigiriya.jpg",
    title: "Sigiriya Lion Rock",
    category: "heritage",
    span: "wide",
  },
  {
    id: "sg-sigiriya-2",
    src: "/images/gallery/gallery-sigiriya-2.jpg",
    title: "Sigiriya Lion Rock",
    category: "heritage",
  },
  {
    id: "sg-sigiriya-3",
    src: "/images/gallery/gallery-sigiriya-3.jpg",
    title: "Sigiriya from the hills",
    category: "heritage",
  },
  {
    id: "sg-sigiriya-4",
    src: "/images/gallery/gallery-sigiriya-4.jpg",
    title: "Sigiriya Rock Fortress",
    category: "heritage",
  },
  // Temple of the Tooth (multiple)
  {
    id: "sg-tooth",
    src: "/images/gallery/gallery-tooth.jpg",
    title: "Temple of the Tooth, Kandy",
    category: "heritage",
  },
  {
    id: "sg-tooth-2",
    src: "/images/gallery/gallery-tooth-2.jpg",
    title: "Temple of the Tooth, Kandy",
    category: "heritage",
  },
  {
    id: "sg-tooth-3",
    src: "/images/gallery/gallery-tooth-3.jpg",
    title: "Sri Dalada Maligawa",
    category: "heritage",
  },
  // Nuwara Eliya / tea (multiple)
  {
    id: "sg-tea",
    src: "/images/gallery/gallery-tea.jpg",
    title: "Nuwara Eliya tea estates",
    category: "hills",
    span: "tall",
  },
  {
    id: "sg-tea-2",
    src: "/images/gallery/gallery-tea-2.jpg",
    title: "Nuwara Eliya tea estates",
    category: "hills",
  },
  {
    id: "sg-tea-3",
    src: "/images/gallery/gallery-tea-3.jpg",
    title: "Tea country, Nuwara Eliya",
    category: "hills",
  },
  {
    id: "sg-tea-picker",
    src: "/images/gallery/tea-picker.jpg",
    title: "Tea country life",
    category: "hills",
  },
  // Ella
  {
    id: "sg-ella",
    src: "/images/gallery/gallery-ella.jpg",
    title: "Nine Arch Bridge, Ella",
    category: "hills",
    span: "wide",
  },
  {
    id: "sg-ravana",
    src: "/images/gallery/ravana-falls.jpg",
    title: "Ravana Falls",
    category: "hills",
  },
  // Wildlife
  {
    id: "sg-yala",
    src: "/images/gallery/gallery-yala.jpg",
    title: "Yala National Park",
    category: "wildlife",
  },
  {
    id: "sg-udawalawe",
    src: "/images/gallery/udawalawe.jpg",
    title: "Udawalawe elephants",
    category: "wildlife",
    span: "wide",
  },
  {
    id: "sg-pinnawala",
    src: "/images/gallery/gallery-pinnawala.jpg",
    title: "Pinnawala elephants",
    category: "wildlife",
  },
  // Heritage / cities
  {
    id: "sg-galle",
    src: "/images/gallery/gallery-galle.jpg",
    title: "Galle Dutch Fort",
    category: "heritage",
  },
  {
    id: "sg-dambulla",
    src: "/images/gallery/gallery-dambulla.jpg",
    title: "Dambulla Cave Temple",
    category: "heritage",
  },
  {
    id: "sg-kandy",
    src: "/images/gallery/gallery-kandy.jpg",
    title: "Kandy Lake",
    category: "heritage",
  },
  {
    id: "sg-polonnaruwa",
    src: "/images/gallery/polonnaruwa.jpg",
    title: "Polonnaruwa Vatadage",
    category: "heritage",
  },
  {
    id: "sg-anuradhapura",
    src: "/images/gallery/anuradhapura.jpg",
    title: "Ruwanwelisaya, Anuradhapura",
    category: "heritage",
  },
  {
    id: "sg-jaffna",
    src: "/images/gallery/jaffna.jpg",
    title: "Nallur Temple, Jaffna",
    category: "heritage",
  },
  // Hills
  {
    id: "sg-horton",
    src: "/images/gallery/horton.jpg",
    title: "Horton Plains",
    category: "hills",
  },
  {
    id: "sg-adam",
    src: "/images/gallery/adam-peak.jpg",
    title: "Adam's Peak",
    category: "hills",
  },
  {
    id: "sg-mist",
    src: "/images/gallery/mist-hills.jpg",
    title: "Highland mist over tea country",
    category: "hills",
    span: "tall",
  },
  // Beach
  {
    id: "sg-beach",
    src: "/images/gallery/gallery-beach.jpg",
    title: "Southern coastline",
    category: "beach",
    span: "wide",
  },
  {
    id: "sg-unawatuna",
    src: "/images/gallery/unawatuna.jpg",
    title: "Unawatuna Beach",
    category: "beach",
  },
  {
    id: "sg-stilt",
    src: "/images/gallery/stilt-fishermen.jpg",
    title: "Stilt fishermen",
    category: "beach",
  },
  {
    id: "sg-whale",
    src: "/images/gallery/whale.jpg",
    title: "Whale watching waters",
    category: "beach",
    span: "wide",
  },
  // Journey
  {
    id: "sg-train",
    src: "/images/gallery/train-hills.jpg",
    title: "Scenic hill-country train",
    category: "journey",
    span: "wide",
  },
  {
    id: "sg-train-window",
    src: "/images/gallery/train-window.jpg",
    title: "Through the carriage window",
    category: "journey",
  },
];

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trips", label: "Our trips" },
  { id: "heritage", label: "Heritage" },
  { id: "hills", label: "Hills & tea" },
  { id: "wildlife", label: "Wildlife" },
  { id: "beach", label: "Beach" },
  { id: "journey", label: "On the road" },
];
