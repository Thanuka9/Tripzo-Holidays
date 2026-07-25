import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SiteContactProvider } from "@/components/SiteContactProvider";
import { getContactSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getContactSettings();

  return (
    <SiteContactProvider value={contact}>
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SiteContactProvider>
  );
}
