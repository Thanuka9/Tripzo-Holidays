import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { getContactSettings } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { hasBlobStore } from "@/lib/storage";

async function logoutAction() {
  "use server";
  const { destroyAdminSession } = await import("@/lib/auth");
  await destroyAdminSession();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  const contact = authed ? await getContactSettings() : null;
  const siteUrl = contact?.siteUrl || SITE.url;
  const needsBlob = authed && Boolean(process.env.VERCEL) && !hasBlobStore();

  return (
    <div className="flex min-h-screen flex-col bg-[#0f1412] text-zinc-100">
      {authed ? (
        <AdminNav onLogout={logoutAction} siteUrl={siteUrl} />
      ) : (
        <header className="shrink-0 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6">
            <span className="font-display text-xl text-sun">Admin login</span>
          </div>
        </header>
      )}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {needsBlob ? (
          <p className="mb-6 rounded-2xl border border-sun/40 bg-sun/10 px-4 py-3 text-sm text-sun">
            Photo uploads need a Vercel Blob store. Open the Vercel project →
            Storage → Create Database → Blob, connect it to this project, then
            redeploy.
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
