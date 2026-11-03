import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handle } from "@/lib/api";
import { isStrongPassword } from "@/lib/validate";

export const POST = handle(async (req) => {
  const { email, token, password } = await req.json();
  if (!token || !email) return fail("This reset link is invalid.");
  if (!isStrongPassword(password)) return fail("Password must be at least 8 characters.");

  await dbConnect();
  const hash = crypto.createHash("sha256").update(String(token)).digest("hex");
  const user = await User.findOne({
    email: String(email).toLowerCase(),
    resetTokenHash: hash,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) return fail("This reset link has expired or was already used. Please request a new one.");

  user.password = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return ok({ ok: true });
});
