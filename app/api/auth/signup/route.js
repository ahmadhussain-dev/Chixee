import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { ok, fail, handle } from "@/lib/api";
import { clean, isEmail, isPhone, isStrongPassword, normalizePhone } from "@/lib/validate";

export const POST = handle(async (req) => {
  const body = await req.json();
  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const phone = normalizePhone(body.phone);
  const password = String(body.password || "");

  if (name.length < 2) return fail("Please enter your full name.");
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (!isPhone(phone)) return fail("Please enter a valid mobile number like 03XX XXXXXXX.");
  if (!isStrongPassword(password)) return fail("Password must be at least 8 characters.");

  await dbConnect();
  if (await User.exists({ email })) return fail("An account with this email already exists.", 409);
  if (await User.exists({ phone })) return fail("An account with this mobile number already exists.", 409);

  const hash = await bcrypt.hash(password, 12);
  await User.create({ name, email, phone, password: hash });
  return ok({ ok: true }, { status: 201 });
});
