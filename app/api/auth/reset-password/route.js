import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handle, readJson, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/log";
import { isStrongPassword } from "@/lib/validate";

export const POST = handle(async (req) => {
  await rateLimit(`reset:${clientIp(req)}`, { limit: 10, windowSec: 3600 });
  const { email, token, password } = await readJson(req);
  if (!token || !email) return fail("This reset link is invalid.");
  if (!isStrongPassword(password)) return fail("Password must be at least 8 characters.");

  await dbConnect();
  const hash = crypto.createHash("sha256").update(String(token)).digest("hex");
  const user = await User.findOne({
    email: String(email).toLowerCase(),
    resetTokenHash: hash,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) return fail("This reset link has expired or was already used. Please request a new one.", 410);

  user.password = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  log.info("auth.password_reset", { userId: user._id.toString() });
  return ok({ ok: true });
});
