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

export type GalleryImage = {
  id: string;
  src: string;
  title: string;
  caption?: string;
  place?: string;
  people?: string;
  kind?: "general" | "team";
  createdAt: string;
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
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf8",
  );
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

export async function getGallery() {
  return readJson<GalleryImage[]>("gallery.json", []);
}

export async function addGalleryImage(
  input: Omit<GalleryImage, "id" | "createdAt">,
) {
  const gallery = await getGallery();
  const image: GalleryImage = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  gallery.unshift(image);
  await writeJson("gallery.json", gallery);
  return image;
}

export async function deleteGalleryImage(id: string) {
  const gallery = await getGallery();
  const next = gallery.filter((g) => g.id !== id);
  await writeJson("gallery.json", next);
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
  const record: FleetRecord = {
    ...vehicle,
    createdAt: idx >= 0 ? fleet[idx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) fleet[idx] = record;
  else fleet.push(record);
  await writeJson("fleet.json", fleet);
  return record;
}

export async function deleteFleetVehicle(id: string) {
  const fleet = await getFleet();
  const next = fleet.filter((v) => v.id !== id);
  await writeJson("fleet.json", next);
  return next;
}

export async function getDestinations() {
  const seeded = defaultDestinations.map((d) => ({
    ...d,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  return readJson<DestinationRecord[]>("destinations.json", seeded);
}

export async function upsertDestination(destination: Destination) {
  const list = await getDestinations();
  const idx = list.findIndex((d) => d.id === destination.id);
  const record: DestinationRecord = {
    ...destination,
    createdAt: idx >= 0 ? list[idx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = record;
  else list.push(record);
  await writeJson("destinations.json", list);
  return record;
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
  return gallery.filter((g) => g.kind === "team");
}
