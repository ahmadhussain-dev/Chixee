import { put } from "@vercel/blob";
import { ok, fail, route } from "@/lib/api";
import { slug } from "@/lib/menu";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";

const TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };
const MAX_BYTES = 4 * 1024 * 1024; // Vercel accepts request bodies up to 4.5 MB

// Uploads a menu or deal photo to Vercel Blob and returns its public URL.
export const POST = route(async (req, _ctx, { session: admin }) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return fail("Photo uploads aren't set up yet: connect a Blob store to this project in Vercel (Storage tab).", 503);
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return fail("Choose a photo to upload.", 400);
  const ext = TYPES[file.type];
  if (!ext) return fail("Use a PNG, JPG, WebP or AVIF photo.", 415);
  if (file.size > MAX_BYTES) return fail("That photo is over 4 MB. Please use a smaller one.", 413);
  const name = slug(form.get("name") || "photo").slice(0, 40) || "photo";
  const blob = await put(`menu/${name}.${ext}`, file, { access: "public", addRandomSuffix: true, contentType: file.type });
  log.info("menu.photo_uploaded", { url: blob.url, bytes: file.size, by: admin.user.email });
  return ok({ url: blob.url }, { status: 201 });
}, { auth: "admin" });
