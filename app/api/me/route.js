import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { clean } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const session = await getSession();
  if (!session) return fail("Please sign in.", 401);
  await dbConnect();
  const u = await User.findById(session.user.id).lean();
  if (!u) return fail("Account not found.", 404);
  return ok({
    name: u.name,
    email: u.email,
    phone: u.phone,
    addresses: (u.addresses || []).map((a) => ({ id: a._id.toString(), label: a.label, line: a.line, area: a.area, city: a.city })),
  });
});

// Add or remove a saved address: { action: "add", label, line, area } | { action: "remove", id }
export const POST = handle(async (req) => {
  const session = await getSession();
  if (!session) return fail("Please sign in.", 401);
  const body = await req.json();
  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return fail("Account not found.", 404);
  if (body.action === "remove") {
    user.addresses = user.addresses.filter((a) => a._id.toString() !== body.id);
  } else {
    const line = clean(body.line, 300);
    if (line.length < 5) return fail("Please enter your full address.");
    if (user.addresses.length >= 10) return fail("You can save up to 10 addresses.");
    user.addresses.push({ label: clean(body.label, 30) || "Home", line, area: clean(body.area, 80), city: "Faisalabad" });
  }
  await user.save();
  return ok({ addresses: user.addresses.map((a) => ({ id: a._id.toString(), label: a.label, line: a.line, area: a.area, city: a.city })) });
});
