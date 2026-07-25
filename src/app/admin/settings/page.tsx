"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { ContactSettings } from "@/lib/db";

const empty: ContactSettings = {
  phone: "",
  phoneDisplay: "",
  whatsapp: "",
  email: "",
  messenger: "",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ContactSettings>(empty);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setSettings(data.settings || empty);
      setLoading(false);
    })();
  }, [router]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setPending(false);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setSettings(data.settings);
    setMessage("Contact details saved. Refresh the public site to see updates.");
  }

  if (loading) {
    return <p className="text-zinc-400">Loading settings…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-sun">Site settings</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Update the phone, WhatsApp, email, and Messenger links shown across the
        website (header, footer, contact, WhatsApp button).
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 max-w-xl space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <Field
          label="Phone (tel link)"
          hint="Include country code, e.g. +94766493348"
          value={settings.phone}
          onChange={(phone) => setSettings((s) => ({ ...s, phone }))}
        />
        <Field
          label="Phone display"
          hint="How it appears on the site, e.g. 076 649 3348"
          value={settings.phoneDisplay}
          onChange={(phoneDisplay) =>
            setSettings((s) => ({ ...s, phoneDisplay }))
          }
        />
        <Field
          label="WhatsApp number"
          hint="Digits only for wa.me, e.g. 94766493348"
          value={settings.whatsapp}
          onChange={(whatsapp) => setSettings((s) => ({ ...s, whatsapp }))}
        />
        <Field
          label="Email"
          type="email"
          value={settings.email}
          onChange={(email) => setSettings((s) => ({ ...s, email }))}
        />
        <Field
          label="Messenger link (optional)"
          hint="e.g. https://m.me/TripzoHolidays"
          value={settings.messenger}
          onChange={(messenger) => setSettings((s) => ({ ...s, messenger }))}
        />

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-4 py-3 text-sm font-bold text-jungle disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save contact details
        </button>
        {message && <p className="text-sm text-zinc-300">{message}</p>}
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={type === "email" || label.includes("Phone")}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-sun/50"
      />
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}
