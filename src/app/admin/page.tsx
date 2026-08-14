import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getBookings,
  getFleet,
  getGallery,
  getDestinations,
  getReviews,
  getTours,
} from "@/lib/db";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [bookings, gallery, fleet, destinations, reviews, tours] = await Promise.all([
    getBookings(),
    getGallery(),
    getFleet(),
    getDestinations(),
    getReviews(),
    getTours(),
  ]);

  return (
    <AdminDashboardClient
      initialBookings={bookings}
      stats={{
        bookings: bookings.length,
        newBookings: bookings.filter((b) => b.status === "new").length,
        destinations: destinations.length,
        gallery: gallery.length,
        fleet: fleet.length,
        reviews: reviews.length,
        pendingReviews: reviews.filter((r) => r.status === "pending").length,
        tours: tours.length,
      }}
    />
  );
}
