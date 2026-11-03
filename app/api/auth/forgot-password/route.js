import crypto from "node:crypto";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { ok, handle } from "@/lib/api";
import { sendResetEmail } from "@/lib/email";
import { SITE } from "@/data/site";

export const POST = handle(async (req) => {
  const { email } = await req.json();
  const addr = String(email || "").trim().toLowerCase();
  await dbConnect();
  const user = addr ? await User.findOne({ email: addr }) : null;

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const base = process.env.NEXTAUTH_URL || SITE.url;
    await sendResetEmail(user.email, user.name, `${base}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`);
  }
  // Same answer either way so nobody can check which emails are registered.
  return ok({ ok: true });
});
