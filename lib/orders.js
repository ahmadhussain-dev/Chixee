import crypto from "node:crypto";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function orderCode() {
  const bytes = crypto.randomBytes(6);
  return "CX-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

// What a customer (or anyone holding the order code) may see.
export function publicOrder(o) {
  return {
    code: o.code,
    type: o.type,
    status: o.status,
    customerName: o.customer?.name,
    area: o.address?.area,
    lines: o.lines,
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    payment: { method: o.payment?.method, verified: o.payment?.verified },
    rider: o.status === "dispatched" ? o.rider : undefined,
    history: o.history,
    createdAt: o.createdAt,
  };
}

// Full order for the admin panel (ids as strings so it serialises cleanly).
export function adminOrder(o) {
  return { ...o, _id: String(o._id), user: o.user ? String(o.user) : null };
}
