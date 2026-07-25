"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { SITE, whatsappLink } from "@/lib/constants";
import type { ContactSettings } from "@/lib/db";

const defaultContact: ContactSettings = {
  phone: SITE.phone,
  phoneDisplay: SITE.phoneDisplay,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  messenger: SITE.messenger,
};

const ContactContext = createContext<ContactSettings>(defaultContact);

export function SiteContactProvider({
  value,
  children,
}: {
  value: ContactSettings;
  children: ReactNode;
}) {
  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}

export function useWhatsAppLink() {
  const contact = useContact();
  return useMemo(
    () => (message?: string) => whatsappLink(message, contact.whatsapp),
    [contact.whatsapp],
  );
}
