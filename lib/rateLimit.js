import { dbConnect } from "@/lib/db";
import RateLimit from "@/models/RateLimit";
import { HttpError } from "@/lib/api";
import { log } from "@/lib/log";

// Fixed-window rate limit shared by every server instance (stored in MongoDB, since Vercel runs many
// short-lived instances and in-memory counters would reset). Throws a 429 HttpError when over the limit.
// rateLimit("login:03001234567", { limit: 10, windowSec: 900 })
export async function rateLimit(key, { limit, windowSec, message = "Too many attempts. Please wait a few minutes and try again." }) {
  await dbConnect();
  const now = new Date();
  // Start a fresh window if the old one has ended (MongoDB's TTL cleanup can run up to a minute late).
  await RateLimit.deleteOne({ key, resetAt: { $lte: now } });
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $setOnInsert: { resetAt: new Date(now.getTime() + windowSec * 1000) } },
    { upsert: true, new: true }
  ).lean().catch(async (e) => {
    if (e.code === 11000) return RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true }).lean(); // two requests created it at once
    throw e;
  });
  if (doc.count > limit) {
    const retry = Math.max(1, Math.ceil((new Date(doc.resetAt) - now) / 1000));
    log.warn("rate_limited", { key, count: doc.count, limit });
    throw new HttpError(429, message, { "Retry-After": String(retry) });
  }
}
