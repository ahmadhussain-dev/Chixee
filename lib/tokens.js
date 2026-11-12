import crypto from "node:crypto";
import { dbConnect } from "@/lib/db";
import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User";
import { log } from "@/lib/log";

// Access + refresh tokens on top of NextAuth's session cookie.
// - The session cookie (encrypted JWT) carries a short-lived access window (ACCESS_SEC) and an opaque refresh token.
// - When the access window ends, proxy.js swaps the refresh token for a new one (rotation) and re-reads the user,
//   so a role change, a password reset, "log out" or a deleted account takes effect within 15 minutes.
// - A refresh token can be used once. Using an old one again means it was copied: every session from that
//   sign-in is revoked. Requests sent at the same moment (a page and its data loads) share the same replacement
//   for GRACE_MS instead of tripping that alarm.

export const ACCESS_SEC = 15 * 60;
export const REFRESH_SEC = 30 * 24 * 60 * 60;
const GRACE_MS = 30 * 1000;

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const key = () => crypto.createHash("sha256").update(`refresh:${process.env.NEXTAUTH_SECRET || ""}`).digest();

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}
function decrypt(blob) {
  const [iv, tag, data] = blob.split(".").map((s) => Buffer.from(s, "base64url"));
  const d = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString("utf8");
}

async function create(userId, family) {
  const raw = crypto.randomBytes(32).toString("base64url");
  await RefreshToken.create({ hash: sha(raw), user: userId, family, expiresAt: new Date(Date.now() + REFRESH_SEC * 1000) });
  return raw;
}

// New sign-in: a new family.
export async function issueRefresh(userId) {
  await dbConnect();
  const family = crypto.randomUUID();
  return { refresh: await create(userId, family), family };
}

const userClaims = (u) => ({ id: u._id.toString(), name: u.name, email: u.email, phone: u.phone || "", role: u.role });

/** Returns { refresh, user } with a fresh token, or { error } ("unknown" | "revoked" | "reused" | "no-user"). */
export async function rotateRefresh(raw) {
  if (!raw) return { error: "unknown" };
  await dbConnect();
  const doc = await RefreshToken.findOne({ hash: sha(raw) });
  if (!doc) return { error: "unknown" };
  if (doc.revokedAt || doc.expiresAt < new Date()) return { error: "revoked" };
  const user = await User.findById(doc.user).lean();
  if (!user) return { error: "no-user" };

  const shared = async (d) => {
    if (d.replacedByEnc && Date.now() - d.usedAt.getTime() < GRACE_MS) return { refresh: decrypt(d.replacedByEnc), user: userClaims(user) };
    await RefreshToken.updateMany({ family: d.family, revokedAt: null }, { $set: { revokedAt: new Date() } });
    log.warn("auth.refresh_reused", { userId: user._id.toString(), family: d.family });
    return { error: "reused" };
  };
  if (doc.usedAt) return shared(doc);

  const next = await create(doc.user, doc.family);
  const claimed = await RefreshToken.findOneAndUpdate({ _id: doc._id, usedAt: null }, { $set: { usedAt: new Date(), replacedByEnc: encrypt(next) } }, { new: true });
  if (!claimed) {
    // Another request rotated it a moment ago: use its replacement and drop ours.
    await RefreshToken.deleteOne({ hash: sha(next) });
    return shared(await RefreshToken.findById(doc._id));
  }
  return { refresh: next, user: userClaims(user) };
}

export async function revokeFamily(family) {
  if (!family) return;
  await dbConnect();
  await RefreshToken.updateMany({ family, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

// Signs the user out everywhere (e.g. after a password reset), within ACCESS_SEC.
export async function revokeAllForUser(userId) {
  await dbConnect();
  await RefreshToken.updateMany({ user: userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
