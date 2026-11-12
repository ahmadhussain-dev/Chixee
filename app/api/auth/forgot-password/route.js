import crypto from "node:crypto";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { ok, handle, readJson, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/log";
import { sendResetEmail } from "@/lib/email";
import { SITE } from "@/data/site";

export const POST = handle(async (req) => {
  const { email } = await readJson(req);
  const addr = String(email || "").trim().toLowerCase();
  await rateLimit(`forgot:${clientIp(req)}`, { limit: 5, windowSec: 3600 });
  if (addr) await rateLimit(`forgot:${addr}`, { limit: 3, windowSec: 3600, message: "We already sent reset emails to this address. Please check your inbox (and spam) or try again in an hour." });
  await dbConnect();
  const user = addr ? await User.findOne({ email: addr }) : null;

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const base = process.env.NEXTAUTH_URL || SITE.url;
    log.info("auth.reset_requested", { userId: user._id.toString() });
    await sendResetEmail(user.email, user.name, `${base}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`);
  }
  // Same answer either way so nobody can check which emails are registered.
  return ok({ ok: true });
});
