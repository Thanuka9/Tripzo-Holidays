import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { defaultFleet, type Vehicle } from "./fleet";
import { defaultDestinations, type Destination } from "./destinations";

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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Read-only filesystem (Vercel serverless) — ignore
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
  const seeded = demoBookings();
  return readJson<Booking[]>("bookings.json", seeded);
}

function demoBookings(): Booking[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = (n: number) =>
    `${y}-${m}-${String(Math.min(28, Math.max(1, n))).padStart(2, "0")}`;

  return [
    {
      id: "demo-1",
      createdAt: new Date().toISOString(),
      name: "Sarah Mitchell",
      email: "sarah@example.com",
      phone: "+94770000001",
      tourSlug: "seven-days-sri-lanka",
      tourTitle: "Seven Days Sri Lanka Tour",
      vehicleId: "kdh",
      startDate: d(now.getDate() + 3),
      travelers: 2,
      pickup: "CMB Airport",
      message: "Looking forward to the scenic train day!",
      status: "new",
    },
    {
      id: "demo-2",
      createdAt: new Date().toISOString(),
      name: "Arun Perera",
      email: "arun@example.com",
      phone: "+94770000002",
      tourSlug: "airport-transfer",
      tourTitle: "Airport Pickup & Drop",
      vehicleId: "prius",
      startDate: d(now.getDate() + 1),
      travelers: 3,
      pickup: "Negombo hotel",
      message: "Evening flight arrival.",
      status: "confirmed",
    },
    {
      id: "demo-3",
      createdAt: new Date().toISOString(),
      name: "Emily Chen",
      email: "emily@example.com",
      phone: "+94770000003",
      tourSlug: "sigiriya-day-tour",
      tourTitle: "Sigiriya & Cultural Triangle",
      vehicleId: "kdh",
      startDate: d(now.getDate() + 8),
      travelers: 4,
      pickup: "Kandy",
      status: "confirmed",
    },
    {
      id: "demo-4",
      createdAt: new Date().toISOString(),
      name: "James Walker",
      email: "james@example.com",
      phone: "+94770000004",
      tourSlug: "kandy-city-tour",
      tourTitle: "Kandy City Tour",
      startDate: d(now.getDate() + 12),
      travelers: 2,
      pickup: "Kandy city hotel",
      status: "new",
    },
    {
      id: "demo-5",
      createdAt: new Date().toISOString(),
      name: "Nimal Fernando",
      email: "nimal@example.com",
      phone: "+94770000005",
      tourTitle: "Custom south coast",
      vehicleId: "coaster",
      startDate: d(now.getDate() - 2),
      travelers: 18,
      pickup: "Colombo",
      status: "completed",
    },
  ];
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
  if (gallery.some((g) => g.kind === "hero")) return gallery;

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

/** Seed curated Sri Lanka showcase photos so they appear in admin Images */
export async function ensureShowcaseGallery() {
  const { showcaseGallery } = await import("./gallery");
  const gallery = await getGallery();
  const existingIds = new Set(gallery.map((g) => g.id));
  const existingSrcs = new Set(gallery.map((g) => g.src));

  const missing = showcaseGallery.filter(
    (s) => !existingIds.has(s.id) && !existingSrcs.has(s.src),
  );
  if (missing.length === 0) return gallery;

  const seeded: GalleryImage[] = missing.map((s, i) => ({
    id: s.id,
    src: s.src,
    title: s.title,
    kind: "general" as const,
    category: s.category,
    place: s.category,
    caption: s.category,
    sortOrder: i,
    featured: i === 0,
    createdAt: new Date().toISOString(),
  }));
  const next = [...gallery, ...seeded];
  try {
    await writeJson("gallery.json", next);
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

export async function getDestinations() {
  const seeded = defaultDestinations.map((d) => ({
    ...d,
    gallery: d.gallery?.length ? d.gallery : [d.image],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  const stored = await readJson<DestinationRecord[]>(
    "destinations.json",
    seeded,
  );
  const defaults = new Map(defaultDestinations.map((d) => [d.id, d]));

  return stored.map((d) => {
    const def = defaults.get(d.id);
    if (d.gallery && d.gallery.length > 0) {
      return { ...d, image: d.image || d.gallery[0] };
    }
    if (def?.gallery?.length) {
      return {
        ...d,
        image: def.image,
        gallery: def.gallery,
      };
    }
    return {
      ...d,
      gallery: d.image ? [d.image] : [],
    };
  });
}

export async function upsertDestination(destination: Destination) {
  const list = await getDestinations();
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
  return record;
}

export async function updateDestinationGallery(
  id: string,
  gallery: string[],
  mainImage?: string,
) {
  const list = await getDestinations();
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
  return list[idx];
}

export async function addDestinationGalleryImage(id: string, src: string) {
  const list = await getDestinations();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const gallery = [...(list[idx].gallery || [list[idx].image]), src];
  list[idx] = {
    ...list[idx],
    gallery,
    image: list[idx].image || src,
    updatedAt: new Date().toISOString(),
  };
  await writeJson("destinations.json", list);
  return list[idx];
}

export async function deleteDestination(id: string) {
  const list = await getDestinations();
  const next = list.filter((d) => d.id !== id);
  await writeJson("destinations.json", next);
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
