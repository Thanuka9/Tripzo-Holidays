import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { defaultFleet, type Vehicle } from "./fleet";
import { defaultDestinations, type Destination } from "./destinations";
import { defaultTours, type Tour } from "./tours";
import { SITE } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data");

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  tourSlug?: string;
  tourTitle?: string;
  vehicleId?: string;
  startDate: string;
  travelers: number;
  pickup?: string;
  message?: string;
  status: BookingStatus;
};

export type GalleryKind = "general" | "team" | "hero";

export type GalleryImage = {
  id: string;
  src: string;
  title: string;
  caption?: string;
  place?: string;
  people?: string;
  kind?: GalleryKind;
  /** Public gallery filter category (heritage, hills, etc.) */
  category?: string;
  sortOrder?: number;
  /** Cover / lead image within its kind (hero, team, or general) */
  featured?: boolean;
  createdAt: string;
};

export type ContactSettings = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  messenger: string;
  siteUrl: string;
};

export type ReviewStatus = "pending" | "approved" | "hidden";

export type Review = {
  id: string;
  createdAt: string;
  name: string;
  country?: string;
  rating: number;
  comment: string;
  tourTitle?: string;
  status: ReviewStatus;
};

export type FleetRecord = Vehicle & {
  createdAt: string;
  updatedAt: string;
};

export type DestinationRecord = Destination & {
  createdAt: string;
  updatedAt: string;
};

export type TourRecord = Tour & {
  createdAt: string;
  updatedAt: string;
};

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Read-only filesystem (Vercel serverless)  -  ignore
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // Seed files when possible; on Vercel the disk is read-only so just use fallback
    try {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
    } catch {
      /* no persistent storage on this host */
    }
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDataDir();
  try {
    await fs.writeFile(
      path.join(DATA_DIR, file),
      JSON.stringify(data, null, 2),
      "utf8",
    );
  } catch {
    throw new Error(
      "File storage is read-only on this host. Use a database for production admin writes.",
    );
  }
}

export async function getBookings() {
  return readJson<Booking[]>("bookings.json", []);
}

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">,
) {
  const bookings = await getBookings();
  const booking: Booking = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  bookings.unshift(booking);
  await writeJson("bookings.json", bookings);
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], status };
  await writeJson("bookings.json", bookings);
  return bookings[idx];
}

export async function deleteBooking(id: string) {
  const bookings = await getBookings();
  const next = bookings.filter((b) => b.id !== id);
  if (next.length === bookings.length) return null;
  await writeJson("bookings.json", next);
  return next;
}

function sortGallery(items: GalleryImage[]) {
  return [...items].sort((a, b) => {
    const ao = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bo = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getGallery() {
  const gallery = await readJson<GalleryImage[]>("gallery.json", []);
  return sortGallery(gallery);
}

export async function addGalleryImage(
  input: Omit<GalleryImage, "id" | "createdAt" | "sortOrder"> & {
    sortOrder?: number;
  },
) {
  const gallery = await getGallery();
  const kindItems = gallery.filter((g) => (g.kind || "general") === (input.kind || "general"));
  const maxOrder = kindItems.reduce((m, g) => Math.max(m, g.sortOrder ?? -1), -1);
  const image: GalleryImage = {
    ...input,
    id: randomUUID(),
    sortOrder: input.sortOrder ?? maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  gallery.push(image);
  await writeJson("gallery.json", gallery);
  return image;
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<
    Pick<
      GalleryImage,
      | "title"
      | "caption"
      | "place"
      | "people"
      | "kind"
      | "src"
      | "sortOrder"
      | "featured"
      | "category"
    >
  >,
) {
  const gallery = await getGallery();
  const idx = gallery.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  ) as typeof patch;
  gallery[idx] = { ...gallery[idx], ...cleaned };
  await writeJson("gallery.json", gallery);
  return gallery[idx];
}

export async function setGalleryMain(id: string) {
  const gallery = await getGallery();
  const target = gallery.find((g) => g.id === id);
  if (!target) return null;
  const kind = target.kind || "general";
  const updated = gallery.map((item) => {
    if ((item.kind || "general") !== kind) return item;
    return { ...item, featured: item.id === id };
  });
  await writeJson("gallery.json", updated);
  return sortGallery(updated);
}

export async function reorderGallery(orderedIds: string[]) {
  const gallery = await getGallery();
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  const updated = gallery.map((item) =>
    orderMap.has(item.id)
      ? { ...item, sortOrder: orderMap.get(item.id)! }
      : item,
  );
  await writeJson("gallery.json", updated);
  return sortGallery(updated);
}

export async function deleteGalleryImage(id: string) {
  const gallery = await getGallery();
  const next = gallery.filter((g) => g.id !== id);
  await writeJson("gallery.json", next);
  return sortGallery(next);
}

export async function ensureDefaultHeroSlides() {
  const { slideshowSlides } = await import("./destinations");
  const gallery = await getGallery();
  const heroes = gallery.filter((g) => g.kind === "hero");
  if (heroes.length > 0) {
    return gallery;
  }

  const seeded: GalleryImage[] = slideshowSlides.map((s, i) => ({
    id: `hero-seed-${i + 1}`,
    src: s.src,
    title: s.title,
    caption: s.caption,
    kind: "hero",
    sortOrder: i,
    createdAt: new Date().toISOString(),
  }));
  const next = [...seeded, ...gallery];
  try {
    await writeJson("gallery.json", next);
  } catch {
    return sortGallery(next);
  }
  return sortGallery(next);
}

/** Seed curated Sri Lanka showcase photos once. Never overwrite admin edits. */
export async function ensureShowcaseGallery() {
  const { showcaseGallery, showcaseAlbums } = await import("./gallery");
  const gallery = await getGallery();
  const byId = new Map(gallery.map((g) => [g.id, g]));
  const meta = await readJson<{ seeded?: boolean }>("gallery-meta.json", {});

  if (meta.seeded && gallery.length > 0) {
    return gallery;
  }

  let changed = false;
  const albumTitleById = new Map(
    showcaseAlbums.flatMap((album) =>
      album.photos.map((photo) => [photo.id, album.title] as const),
    ),
  );

  for (const [i, s] of showcaseGallery.entries()) {
    if (byId.has(s.id)) continue;
    const albumTitle = albumTitleById.get(s.id) || s.title;
    byId.set(s.id, {
      id: s.id,
      src: s.src,
      title: s.title,
      kind: "general",
      category: s.category,
      place: albumTitle,
      caption: s.category,
      sortOrder: i,
      featured: i === 0,
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }

  if (!changed) {
    try {
      await writeJson("gallery-meta.json", { seeded: true });
    } catch {
      /* read-only host */
    }
    return gallery;
  }

  const next = Array.from(byId.values());
  try {
    await writeJson("gallery.json", next);
    await writeJson("gallery-meta.json", { seeded: true });
  } catch {
    return sortGallery(next);
  }
  return sortGallery(next);
}

export async function getHeroSlides() {
  const gallery = await ensureDefaultHeroSlides();
  const heroes = gallery.filter((g) => g.kind === "hero");
  if (heroes.length === 0) {
    const { slideshowSlides } = await import("./destinations");
    return slideshowSlides;
  }
  const featured = heroes.find((h) => h.featured);
  const ordered = featured
    ? [featured, ...heroes.filter((h) => h.id !== featured.id)]
    : heroes;
  return ordered.map((h) => ({
    src: h.src,
    title: h.title,
    caption: h.caption || h.place || "",
  }));
}

export async function getFeaturedGalleryCover() {
  const uploads = await getPublicGalleryUploads();
  const general = uploads.filter((g) => (g.kind || "general") === "general");
  const team = uploads.filter((g) => g.kind === "team");
  return (
    general.find((g) => g.featured) ||
    team.find((g) => g.featured) ||
    general[0] ||
    team[0] ||
    null
  );
}

const defaultContact = (): ContactSettings => ({
  phone: process.env.NEXT_PUBLIC_PHONE || "+94766493348",
  phoneDisplay: "076 649 3348",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "94766493348",
  email: process.env.NEXT_PUBLIC_EMAIL || "chathurasamarakoon9@gmail.com",
  messenger:
    process.env.NEXT_PUBLIC_MESSENGER || "https://m.me/TripzoHolidays",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || SITE.url,
});

export async function getContactSettings(): Promise<ContactSettings> {
  const stored = await readJson<Partial<ContactSettings>>(
    "settings.json",
    {},
  );
  return { ...defaultContact(), ...stored };
}

export async function updateContactSettings(
  patch: Partial<ContactSettings>,
): Promise<ContactSettings> {
  const current = await getContactSettings();
  const next: ContactSettings = {
    phone: patch.phone?.trim() || current.phone,
    phoneDisplay: patch.phoneDisplay?.trim() || current.phoneDisplay,
    whatsapp: (patch.whatsapp?.trim() || current.whatsapp).replace(/\D/g, ""),
    email: patch.email?.trim() || current.email,
    messenger: patch.messenger?.trim() || current.messenger,
    siteUrl: (patch.siteUrl?.trim() || current.siteUrl || SITE.url).replace(
      /\/$/,
      "",
    ),
  };
  await writeJson("settings.json", next);
  return next;
}

export async function getFleet() {
  const seeded = defaultFleet.map((v) => ({
    ...v,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  return readJson<FleetRecord[]>("fleet.json", seeded);
}

export async function upsertFleetVehicle(vehicle: Vehicle) {
  const fleet = await getFleet();
  const idx = fleet.findIndex((v) => v.id === vehicle.id);
  const existing = idx >= 0 ? fleet[idx] : null;
  const gallery =
    vehicle.gallery ??
    existing?.gallery ??
    (vehicle.image ? [vehicle.image] : []);
  const record: FleetRecord = {
    ...vehicle,
    gallery,
    image: vehicle.image || gallery[0] || existing?.image || "",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) fleet[idx] = record;
  else fleet.push(record);
  await writeJson("fleet.json", fleet);
  return record;
}

export async function updateFleetGallery(
  id: string,
  gallery: string[],
  mainImage?: string,
) {
  const fleet = await getFleet();
  const idx = fleet.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  const nextGallery = gallery.filter(Boolean);
  const currentMain = fleet[idx].image;
  const image =
    (mainImage && nextGallery.includes(mainImage) && mainImage) ||
    (nextGallery.includes(currentMain) && currentMain) ||
    nextGallery[0] ||
    currentMain;
  fleet[idx] = {
    ...fleet[idx],
    gallery: nextGallery,
    image,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("fleet.json", fleet);
  return fleet[idx];
}

export async function addFleetGalleryImage(id: string, src: string) {
  const fleet = await getFleet();
  const idx = fleet.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  const gallery = [...(fleet[idx].gallery || [fleet[idx].image]), src];
  fleet[idx] = {
    ...fleet[idx],
    gallery,
    image: fleet[idx].image || src,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("fleet.json", fleet);
  return fleet[idx];
}

export async function deleteFleetVehicle(id: string) {
  const fleet = await getFleet();
  const next = fleet.filter((v) => v.id !== id);
  await writeJson("fleet.json", next);
  return next;
}

export async function reorderFleet(orderedIds: string[]) {
  const fleet = await getFleet();
  const byId = new Map(fleet.map((v) => [v.id, v]));
  const ordered: FleetRecord[] = [];
  for (const id of orderedIds) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  for (const leftover of byId.values()) ordered.push(leftover);
  await writeJson("fleet.json", ordered);
  return ordered;
}

const LEGACY_BAD_DEST_IMAGES = new Set([
  "/images/destinations/temple-2.jpg",
  "/images/destinations/kandy-2.jpg",
  "/images/destinations/wildlife-2.jpg",
  "/images/destinations/fort-2.jpg",
  "/images/destinations/beach-2.jpg",
  "/images/destinations/train-2.jpg",
  "/images/destinations/sigiriya-2.jpg",
  "/images/destinations/sigiriya-3.jpg",
  "/images/destinations/sigiriya-view-2.jpg",
  "/images/destinations/sigiriya-view-3.jpg",
  "/images/destinations/temple-of-the-tooth.jpg",
  "/images/destinations/temple-of-the-tooth-2.jpg",
  "/images/destinations/temple-of-the-tooth-3.jpg",
  "/images/gallery/mist-hills.jpg", // was mixed into Nuwara Eliya slideshow
  "/images/gallery/horton.jpg", // not Nuwara Eliya town/estates
]);

function seededDestinations(): DestinationRecord[] {
  return defaultDestinations.map((d) => ({
    ...d,
    gallery: d.gallery?.length ? d.gallery : [d.image],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

async function loadStoredDestinations(): Promise<DestinationRecord[]> {
  const stored = await readJson<DestinationRecord[]>(
    "destinations.json",
    seededDestinations(),
  );
  const known = new Set(stored.map((d) => d.id));
  const extra = seededDestinations().filter((d) => !known.has(d.id));
  return extra.length ? [...stored, ...extra] : stored;
}

function sanitizeDestination(d: DestinationRecord): DestinationRecord {
  const defaults = new Map(defaultDestinations.map((x) => [x.id, x]));
  const gallery = (d.gallery?.length ? d.gallery : d.image ? [d.image] : []).filter(
    (src) => src && !LEGACY_BAD_DEST_IMAGES.has(src),
  );
  if (gallery.length === 0) {
    const def = defaults.get(d.id);
    if (def?.gallery?.length) {
      return { ...d, image: def.image, gallery: def.gallery };
    }
    return { ...d, gallery: [] };
  }
  const image =
    d.image && gallery.includes(d.image) && !LEGACY_BAD_DEST_IMAGES.has(d.image)
      ? d.image
      : gallery[0];
  return { ...d, gallery, image };
}

export async function getDestinations(): Promise<DestinationRecord[]> {
  const stored = await loadStoredDestinations();
  return stored.map(sanitizeDestination);
}

export async function upsertDestination(destination: Destination) {
  const list = await loadStoredDestinations();
  const idx = list.findIndex((d) => d.id === destination.id);
  const existing = idx >= 0 ? list[idx] : null;
  const gallery =
    destination.gallery ??
    existing?.gallery ??
    (destination.image ? [destination.image] : []);
  const record: DestinationRecord = {
    ...destination,
    gallery,
    image: destination.image || gallery[0] || existing?.image || "",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = record;
  else list.push(record);
  await writeJson("destinations.json", list);
  return sanitizeDestination(record);
}

export async function updateDestinationGallery(
  id: string,
  gallery: string[],
  mainImage?: string,
) {
  const list = await loadStoredDestinations();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const nextGallery = gallery.filter(Boolean);
  const currentMain = list[idx].image;
  const image =
    (mainImage && nextGallery.includes(mainImage) && mainImage) ||
    (nextGallery.includes(currentMain) && currentMain) ||
    nextGallery[0] ||
    currentMain;
  list[idx] = {
    ...list[idx],
    gallery: nextGallery,
    image,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("destinations.json", list);
  return sanitizeDestination(list[idx]);
}

export async function addDestinationGalleryImage(id: string, src: string) {
  const list = await loadStoredDestinations();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const gallery = [...(list[idx].gallery || [list[idx].image]), src].filter(
    Boolean,
  );
  list[idx] = {
    ...list[idx],
    gallery,
    image: list[idx].image || src,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("destinations.json", list);
  return sanitizeDestination(list[idx]);
}

export async function addDestinationGalleryImages(id: string, srcs: string[]) {
  const list = await loadStoredDestinations();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const gallery = [
    ...(list[idx].gallery || [list[idx].image]),
    ...srcs,
  ].filter(Boolean);
  list[idx] = {
    ...list[idx],
    gallery,
    image: list[idx].image || srcs[0] || "",
    updatedAt: new Date().toISOString(),
  };
  await writeJson("destinations.json", list);
  return sanitizeDestination(list[idx]);
}

export async function deleteDestination(id: string) {
  const list = await loadStoredDestinations();
  const next = list.filter((d) => d.id !== id);
  await writeJson("destinations.json", next);
  return next.map(sanitizeDestination);
}

function seededTours(): TourRecord[] {
  return defaultTours.map((t) => ({
    ...t,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function getTours(): Promise<TourRecord[]> {
  const stored = await readJson<TourRecord[]>("tours.json", seededTours());
  const known = new Set(stored.map((t) => t.slug));
  const extra = seededTours().filter((t) => !known.has(t.slug));
  return extra.length ? [...stored, ...extra] : stored;
}

export async function getTourBySlug(slug: string) {
  const list = await getTours();
  return list.find((t) => t.slug === slug) || null;
}

export async function upsertTour(tour: Tour) {
  const list = await getTours();
  const idx = list.findIndex((t) => t.slug === tour.slug);
  const existing = idx >= 0 ? list[idx] : null;
  const record: TourRecord = {
    ...tour,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = record;
  else list.push(record);
  await writeJson("tours.json", list);
  return record;
}

export async function deleteTour(slug: string) {
  const list = await getTours();
  const next = list.filter((t) => t.slug !== slug);
  await writeJson("tours.json", next);
  return next;
}

import { googleReviewsSeed } from "./googleReviews";

function demoReviews(): Review[] {
  return googleReviewsSeed.map((r, i) => ({
    ...r,
    id: `grev-${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000 * 12).toISOString(),
    status: "approved" as const,
  }));
}

export async function getReviews() {
  return readJson<Review[]>("reviews.json", demoReviews());
}

export async function getApprovedReviews() {
  const reviews = await getReviews();
  return reviews.filter((r) => r.status === "approved");
}

export async function createReview(
  input: Omit<Review, "id" | "createdAt" | "status">,
) {
  const reviews = await getReviews();
  const review: Review = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  reviews.unshift(review);
  await writeJson("reviews.json", reviews);
  return review;
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const reviews = await getReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], status };
  await writeJson("reviews.json", reviews);
  return reviews[idx];
}

export async function deleteReview(id: string) {
  const reviews = await getReviews();
  const next = reviews.filter((r) => r.id !== id);
  await writeJson("reviews.json", next);
  return next;
}

export async function getTeamPhotos() {
  const gallery = await getGallery();
  const team = gallery.filter((g) => g.kind === "team");
  const featured = team.find((g) => g.featured);
  if (!featured) return team;
  return [featured, ...team.filter((g) => g.id !== featured.id)];
}

export async function getPublicGalleryUploads() {
  await ensureShowcaseGallery();
  const gallery = await getGallery();
  return gallery.filter((g) => g.kind !== "hero");
}
