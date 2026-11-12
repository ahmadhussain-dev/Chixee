import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import Area from "@/models/Area";
import Setting from "@/models/Setting";
import { ok, fail, route, readJson, clientIp } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/log";
import { clean, isEmail, isPhone, normalizePhone } from "@/lib/validate";
import { IF_UNAVAILABLE, priceOf } from "@/lib/menu";
import { getCatalogForOrder } from "@/lib/catalog";
import { orderCode, publicOrder } from "@/lib/orders";
import { SITE } from "@/data/site";
import { publish } from "@/lib/orderEvents";

export const dynamic = "force-dynamic";

// Signed-in customer's own orders
export const GET = route(async (_req, _ctx, { session }) => {
  await dbConnect();
  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).limit(50).lean();
  return ok(orders.map(publicOrder));
}, { auth: "user" });

export const POST = route(async (req, _ctx, { requestId }) => {
  const b = await readJson(req);
  const session = await getSession();

  const type = b.type === "pickup" ? "pickup" : "delivery";
  const name = clean(b.name, 80);
  const phone = normalizePhone(b.phone);
  const altPhone = b.altPhone ? normalizePhone(b.altPhone) : "";
  const email = clean(b.email, 120).toLowerCase();
  const instructions = clean(b.instructions, 500);
  const method = b.paymentMethod === "transfer" ? "transfer" : "cod";
  const transactionId = clean(b.transactionId, 60);

  if (name.length < 2) return fail("Please enter your full name.");
  if (!isPhone(phone)) return fail("Please enter a valid mobile number like 03XX XXXXXXX.");
  if (altPhone && !isPhone(altPhone)) return fail("The alternative number doesn't look right.");
  if (email && !isEmail(email)) return fail("Please enter a valid email or leave it empty.");
  if (method === "transfer" && transactionId.length < 4) return fail("Please enter the transaction ID of your transfer.");

  // Rebuild the cart from the stored menu so prices come from the server, not the browser.
  // Hidden items and deals aren't in the catalog, so they can't be ordered.
  await dbConnect();
  const { ITEM_BY_ID } = await getCatalogForOrder();
  const lines = [];
  for (const raw of Array.isArray(b.items) ? b.items.slice(0, 60) : []) {
    const item = ITEM_BY_ID[raw.id];
    const qty = Math.min(50, Math.max(0, parseInt(raw.qty, 10) || 0));
    if (!item || !qty) continue;
    const size = item.sizes ? (item.sizes[raw.size] ? raw.size : Object.keys(item.sizes)[0]) : null;
    const price = priceOf(item, size);
    const note = clean(raw.note, 200);
    const ifUnavailable = IF_UNAVAILABLE[raw.ifUnavailable] ? raw.ifUnavailable : "remove";
    // Deals carry their contents in the line name so the kitchen sees what to pack.
    const lineName = item.category === "deals" ? `${item.n} (${item.d})` : item.n;
    lines.push({ itemId: item.id, name: lineName, size, price, qty, total: price * qty, note, ifUnavailable });
  }
  if (!lines.length) return fail("Your cart is empty, or its items are no longer on the menu.");

  const settings = await Setting.findOne({ key: "store" }).lean();
  if (settings && settings.acceptingOrders === false) return fail("Sorry, we're not taking online orders right now. Please call " + SITE.uan + ".", 503);

  let address = { line: "", area: "", city: SITE.city };
  let deliveryFee = 0;
  if (type === "delivery") {
    const area = b.areaId ? await Area.findOne({ _id: b.areaId, active: true }).lean().catch(() => null) : null;
    if (!area) return fail("Please choose your delivery area.");
    const line = clean(b.address, 300);
    if (line.length < 5) return fail("Please enter your full delivery address.");
    address = { line, area: area.name, city: area.city };
    deliveryFee = area.fee || 0;
  } else {
    address = { line: SITE.branch.address, area: "Pickup", city: SITE.city };
  }

  // Counted only once the order is valid, so fixing form mistakes never locks a customer out.
  await rateLimit(`order:${clientIp(req)}`, { limit: 10, windowSec: 600, message: "Too many orders from this connection. Please call us if you need to order more." });

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  let order;
  for (let i = 0; i < 3 && !order; i++) {
    try {
      order = await Order.create({
        code: orderCode(),
        user: session?.user?.id || null,
        type,
        customer: { name, phone, altPhone, email },
        address,
        instructions,
        lines,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        payment: { method, transactionId: method === "transfer" ? transactionId : "" },
        history: [{ status: "pending" }],
      });
    } catch (e) {
      if (e.code !== 11000) throw e; // retry only on duplicate code
    }
  }
  if (!order) throw new Error("Could not create a unique order code");
  log.info("order.created", { requestId, code: order.code, total: order.total, type, payment: method, user: order.user?.toString() });
  publish(order.toObject());
  return ok(publicOrder(order), { status: 201 });
});
