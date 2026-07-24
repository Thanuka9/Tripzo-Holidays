import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  return (
    <div className="flex min-h-screen flex-col bg-[#0f1412] text-zinc-100">
      <header className="shrink-0 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BrandLogo href="/admin" onDark size="sm" />
              <span className="font-display text-xl text-sun">Admin</span>
            </div>
            {authed && (
              <nav className="hidden flex-wrap gap-3 text-sm text-zinc-300 lg:flex">
                <Link href="/admin" className="hover:text-white">
                  Overview
                </Link>
                <Link href="/admin/bookings" className="hover:text-white">
                  Bookings
                </Link>
                <Link href="/admin/reviews" className="hover:text-white">
                  Reviews
                </Link>
                <Link href="/admin/destinations" className="hover:text-white">
                  Destinations
                </Link>
                <Link href="/admin/gallery" className="hover:text-white">
                  Trip photos
                </Link>
                <Link href="/admin/fleet" className="hover:text-white">
                  Fleet
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-zinc-400 hover:text-white">
              View site
            </Link>
            {authed && (
              <form
                action={async () => {
                  "use server";
                  const { destroyAdminSession } = await import("@/lib/auth");
                  await destroyAdminSession();
                  redirect("/admin/login");
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-white/15 px-3 py-1.5 hover:bg-white/5"
                >
                  Log out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
