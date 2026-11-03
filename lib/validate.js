// Pakistani mobile numbers are stored as 03XXXXXXXXX.
export function normalizePhone(raw = "") {
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("0092")) d = d.slice(4);
  if (d.startsWith("92")) d = d.slice(2);
  if (d.startsWith("3") && d.length === 10) d = "0" + d;
  return d;
}

export const isPhone = (raw) => /^03\d{9}$/.test(normalizePhone(raw));
export const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isStrongPassword = (s = "") => s.length >= 8;

export const clean = (s, max = 500) => String(s ?? "").trim().slice(0, max);
