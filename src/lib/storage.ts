import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function extensionFor(file: File) {
  const fromName = path.extname(file.name);
  if (fromName) return fromName.toLowerCase();
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return ".jpg";
  return ".jpg";
}

export async function savePublicUpload(
  file: File,
  folder: string,
  basename?: string,
) {
  const ext = extensionFor(file);
  const name = `${basename || "img"}-${randomUUID().slice(0, 8)}${ext}`;
  const pathname = `uploads/${folder}/${name}`;

  if (hasBlobStore()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || "image/jpeg",
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Uploads need Vercel Blob. In the Vercel project open Storage, create a Blob store, then redeploy.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${folder}/${name}`;
}
