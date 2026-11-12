import { dbConnect } from "@/lib/db";
import PushSub from "@/models/PushSub";
import Order from "@/models/Order";
import { ok, fail, route, readJson } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";

const validSub = (s) =>
  s && typeof s.endpoint === "string" && /^https:\/\/\S+$/.test(s.endpoint) && s.endpoint.length < 1000 && typeof s.keys?.p256dh === "string" && typeof s.keys?.auth === "string";

// Save this browser for notifications.
// { subscription, role: "admin" } -> every new order (admins only)
// { subscription, order: "CX-..." } -> status updates for that order
export const POST = route(async (req, _ctx, { requestId }) => {
  const b = await readJson(req);
  if (!validSub(b.subscription)) return fail("This browser didn't give a valid notification subscription.", 422);
  const { endpoint, keys } = b.subscription;
  const session = await getSession();
  await dbConnect();

  if (b.role === "admin") {
    if (!session) return fail("Please sign in.", 401);
    if (session.user.role !== "admin") return fail("Admins only.", 403);
    await PushSub.updateOne({ endpoint }, { $set: { keys: { p256dh: keys.p256dh, auth: keys.auth }, role: "admin", user: session.user.id } }, { upsert: true });
    log.info("push.subscribed", { requestId, role: "admin", user: session.user.id });
    return ok({ ok: true }, { status: 201 });
  }

  const code = String(b.order || "").toUpperCase().slice(0, 20);
  if (!code || !(await Order.exists({ code }))) return fail("Order not found.", 404);
  await PushSub.updateOne(
    { endpoint },
    { $set: { keys: { p256dh: keys.p256dh, auth: keys.auth }, ...(session ? { user: session.user.id } : {}) }, $setOnInsert: { role: "customer" }, $addToSet: { orders: code } },
    { upsert: true }
  );
  // Keep only the 20 most recent orders per browser.
  await PushSub.updateOne({ endpoint, "orders.20": { $exists: true } }, { $push: { orders: { $each: [], $slice: -20 } } });
  log.info("push.subscribed", { requestId, role: "customer", code });
  return ok({ ok: true }, { status: 201 });
});

// Stop notifications for this browser: { endpoint } (all), or { endpoint, role: "admin" } (new-order alerts only).
export const DELETE = route(async (req) => {
  const b = await readJson(req);
  if (typeof b.endpoint !== "string") return fail("Missing endpoint.", 422);
  await dbConnect();
  if (b.role === "admin") await PushSub.updateOne({ endpoint: b.endpoint }, { $set: { role: "customer" } });
  else await PushSub.deleteOne({ endpoint: b.endpoint });
  return ok({ ok: true });
});
