import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContactSettings, updateContactSettings } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getContactSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  try {
    const settings = await updateContactSettings({
      phone: body.phone,
      phoneDisplay: body.phoneDisplay,
      whatsapp: body.whatsapp,
      email: body.email,
      messenger: body.messenger,
      siteUrl: body.siteUrl,
    });
    return NextResponse.json({ settings });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not save settings  -  storage may be read-only on this host.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
