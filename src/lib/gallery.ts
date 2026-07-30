export type GalleryCategory =
  | "heritage"
  | "hills"
  | "wildlife"
  | "beach"
  | "journey"
  | "trips";

export type ShowcasePhoto = {
  id: string;
  src: string;
  title?: string;
};

export type ShowcaseAlbum = {
  id: string;
  title: string;
  category: GalleryCategory;
  cover: string;
  span?: "tall" | "wide" | "normal";
  photos: ShowcasePhoto[];
};

/** @deprecated Prefer ShowcaseAlbum; kept for seed/admin flat rows */
export type ShowcaseImage = {
  id: string;
  src: string;
  title: string;
  category: GalleryCategory;
  span?: "tall" | "wide" | "normal";
  albumId?: string;
};

/** Place albums - one cover on the gallery grid, photos open inside the album. */
export const showcaseAlbums: ShowcaseAlbum[] = [
  {
    id: "album-sigiriya",
    title: "Sigiriya Lion Rock",
    category: "heritage",
    cover: "/images/gallery/gallery-sigiriya.jpg",
    span: "wide",
    photos: [
      { id: "sg-sigiriya", src: "/images/gallery/gallery-sigiriya.jpg", title: "Sigiriya Lion Rock" },
      { id: "sg-sigiriya-2", src: "/images/gallery/gallery-sigiriya-2.jpg", title: "Sigiriya Lion Rock" },
      { id: "sg-sigiriya-3", src: "/images/gallery/gallery-sigiriya-3.jpg", title: "Sigiriya from the hills" },
      { id: "sg-sigiriya-4", src: "/images/gallery/gallery-sigiriya-4.jpg", title: "Sigiriya Rock Fortress" },
    ],
  },
  {
    id: "album-tooth",
    title: "Temple of the Tooth",
    category: "heritage",
    cover: "/images/gallery/gallery-tooth.jpg",
    photos: [
      { id: "sg-tooth", src: "/images/gallery/gallery-tooth.jpg", title: "Temple of the Tooth, Kandy" },
      { id: "sg-tooth-2", src: "/images/gallery/gallery-tooth-2.jpg", title: "Temple of the Tooth, Kandy" },
      { id: "sg-tooth-3", src: "/images/gallery/gallery-tooth-3.jpg", title: "Sri Dalada Maligawa" },
    ],
  },
  {
    id: "album-nuwara-eliya",
    title: "Nuwara Eliya",
    category: "hills",
    cover: "/images/gallery/gallery-tea.jpg",
    span: "tall",
    photos: [
      { id: "sg-tea", src: "/images/gallery/gallery-tea.jpg", title: "Tea estates, Nuwara Eliya" },
      { id: "sg-tea-2", src: "/images/gallery/gallery-tea-2.jpg", title: "Tea pluckers in the hills" },
      { id: "sg-tea-3", src: "/images/gallery/gallery-tea-3.jpg", title: "Gregory Lake" },
      { id: "sg-nuwara-gregory", src: "/images/gallery/nuwara-gregory.jpg", title: "Lake Gregory at dusk" },
      { id: "sg-nuwara-hills", src: "/images/gallery/nuwara-tea-hills.jpg", title: "Highland tea hills" },
      { id: "sg-tea-picker", src: "/images/gallery/tea-picker.jpg", title: "Among the tea bushes" },
      { id: "sg-nuwara-post", src: "/images/gallery/nuwara-post-office.jpg", title: "Nuwara Eliya Post Office" },
      {
        id: "sg-nuwara-town",
        src: "/images/destinations/nuwara-eliya-real-2.webp",
        title: "Nuwara Eliya town",
      },
    ],
  },
  {
    id: "album-ella",
    title: "Ella & Nine Arch Bridge",
    category: "hills",
    cover: "/images/gallery/gallery-ella.jpg",
    span: "wide",
    photos: [
      { id: "sg-ella", src: "/images/gallery/gallery-ella.jpg", title: "Nine Arch Bridge, Ella" },
      { id: "sg-ravana", src: "/images/gallery/ravana-falls.jpg", title: "Ravana Falls" },
    ],
  },
  {
    id: "album-yala",
    title: "Yala National Park",
    category: "wildlife",
    cover: "/images/gallery/gallery-yala.jpg",
    photos: [
      { id: "sg-yala", src: "/images/gallery/gallery-yala.jpg", title: "Yala National Park" },
    ],
  },
  {
    id: "album-udawalawe",
    title: "Udawalawe",
    category: "wildlife",
    cover: "/images/gallery/udawalawe.jpg",
    span: "wide",
    photos: [
      { id: "sg-udawalawe", src: "/images/gallery/udawalawe.jpg", title: "Udawalawe elephants" },
    ],
  },
  {
    id: "album-pinnawala",
    title: "Pinnawala",
    category: "wildlife",
    cover: "/images/gallery/gallery-pinnawala.jpg",
    photos: [
      { id: "sg-pinnawala", src: "/images/gallery/gallery-pinnawala.jpg", title: "Pinnawala elephants" },
    ],
  },
  {
    id: "album-galle",
    title: "Galle Dutch Fort",
    category: "heritage",
    cover: "/images/gallery/gallery-galle.jpg",
    photos: [
      { id: "sg-galle", src: "/images/gallery/gallery-galle.jpg", title: "Galle Dutch Fort" },
    ],
  },
  {
    id: "album-dambulla",
    title: "Dambulla Cave Temple",
    category: "heritage",
    cover: "/images/gallery/gallery-dambulla.jpg",
    photos: [
      { id: "sg-dambulla", src: "/images/gallery/gallery-dambulla.jpg", title: "Dambulla Cave Temple" },
    ],
  },
  {
    id: "album-kandy",
    title: "Kandy Lake",
    category: "heritage",
    cover: "/images/gallery/gallery-kandy.jpg",
    photos: [
      { id: "sg-kandy", src: "/images/gallery/gallery-kandy.jpg", title: "Kandy Lake" },
    ],
  },
  {
    id: "album-polonnaruwa",
    title: "Polonnaruwa",
    category: "heritage",
    cover: "/images/gallery/polonnaruwa.jpg",
    photos: [
      { id: "sg-polonnaruwa", src: "/images/gallery/polonnaruwa.jpg", title: "Polonnaruwa Vatadage" },
    ],
  },
  {
    id: "album-anuradhapura",
    title: "Anuradhapura",
    category: "heritage",
    cover: "/images/gallery/anuradhapura.jpg",
    photos: [
      {
        id: "sg-anuradhapura",
        src: "/images/gallery/anuradhapura.jpg",
        title: "Ruwanwelisaya, Anuradhapura",
      },
    ],
  },
  {
    id: "album-jaffna",
    title: "Jaffna",
    category: "heritage",
    cover: "/images/gallery/jaffna.jpg",
    photos: [
      { id: "sg-jaffna", src: "/images/gallery/jaffna.jpg", title: "Nallur Temple, Jaffna" },
    ],
  },
  {
    id: "album-horton",
    title: "Horton Plains",
    category: "hills",
    cover: "/images/gallery/horton.jpg",
    photos: [
      { id: "sg-horton", src: "/images/gallery/horton.jpg", title: "Horton Plains" },
    ],
  },
  {
    id: "album-adam",
    title: "Adam's Peak",
    category: "hills",
    cover: "/images/gallery/adam-peak.jpg",
    photos: [
      { id: "sg-adam", src: "/images/gallery/adam-peak.jpg", title: "Adam's Peak" },
    ],
  },
  {
    id: "album-mist",
    title: "Highland mist",
    category: "hills",
    cover: "/images/gallery/mist-hills.jpg",
    span: "tall",
    photos: [
      {
        id: "sg-mist",
        src: "/images/gallery/mist-hills.jpg",
        title: "Highland mist over tea country",
      },
    ],
  },
  {
    id: "album-south-coast",
    title: "Southern coastline",
    category: "beach",
    cover: "/images/gallery/gallery-beach.jpg",
    span: "wide",
    photos: [
      { id: "sg-beach", src: "/images/gallery/gallery-beach.jpg", title: "Southern coastline" },
      { id: "sg-unawatuna", src: "/images/gallery/unawatuna.jpg", title: "Unawatuna Beach" },
      { id: "sg-stilt", src: "/images/gallery/stilt-fishermen.jpg", title: "Stilt fishermen" },
      { id: "sg-whale", src: "/images/gallery/whale.jpg", title: "Whale watching waters" },
    ],
  },
  {
    id: "album-train",
    title: "Hill-country train",
    category: "journey",
    cover: "/images/gallery/train-hills.jpg",
    span: "wide",
    photos: [
      { id: "sg-train", src: "/images/gallery/train-hills.jpg", title: "Scenic hill-country train" },
      {
        id: "sg-train-window",
        src: "/images/gallery/train-window.jpg",
        title: "Through the carriage window",
      },
    ],
  },
];

/** Flat list for admin seeding (one row per photo). */
export const showcaseGallery: ShowcaseImage[] = showcaseAlbums.flatMap((album) =>
  album.photos.map((photo, index) => ({
    id: photo.id,
    src: photo.src,
    title: photo.title || album.title,
    category: album.category,
    span: index === 0 ? album.span : undefined,
    albumId: album.id,
  })),
);

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trips", label: "Our trips" },
  { id: "heritage", label: "Heritage" },
  { id: "hills", label: "Hills & tea" },
  { id: "wildlife", label: "Wildlife" },
  { id: "beach", label: "Beach" },
  { id: "journey", label: "On the road" },
];
