import crypto from "node:crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { normalizePhone } from "@/lib/validate";
import { rateLimit } from "@/lib/rateLimit";
import { ACCESS_SEC, REFRESH_SEC, issueRefresh, revokeFamily } from "@/lib/tokens";
import { log } from "@/lib/log";

export const TOO_MANY = "TooManyAttempts";

// Google sign-in appears once GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set.
export const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// How the session works (see lib/tokens.js):
// the NextAuth cookie holds the user, an access expiry (`ax`, 15 minutes) and a refresh token (`rt`).
// proxy.js rotates the refresh token when `ax` has passed; a session whose access window ran out long ago
// (refresh failed or was revoked) counts as signed out.
const STALE_MS = 2 * 60 * 1000;
export const sessionExpired = (token) => !token?.rt || token.err || Date.now() > (token.ax || 0) * 1000 + STALE_MS;

const providers = [
  CredentialsProvider({
    name: "Email or phone",
    credentials: {
      identifier: { label: "Email or mobile", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      const id = (credentials?.identifier || "").trim().toLowerCase();
      const password = credentials?.password || "";
      if (!id || !password) return null;
      // Slow down password guessing: 10 tries per account and 30 per connection every 15 minutes.
      const ip = String(req?.headers?.["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
      try {
        await rateLimit(`login:${id}`, { limit: 10, windowSec: 900 });
        await rateLimit(`login-ip:${ip}`, { limit: 30, windowSec: 900 });
      } catch (e) {
        if (e.status === 429) throw new Error(TOO_MANY);
        throw e;
      }
      await dbConnect();
      const phone = id.includes("@") ? "" : normalizePhone(id);
      if (!id.includes("@") && !phone) return null;
      const user = await User.findOne(id.includes("@") ? { email: id } : { phone }).select("+password");
      const ok = user?.password ? await bcrypt.compare(password, user.password) : false;
      if (!ok) {
        log.warn("auth.login_failed", { by: id.includes("@") ? "email" : "phone" });
        return null;
      }
      log.info("auth.login", { userId: user._id.toString(), method: "password" });
      return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role };
    },
  }),
];

if (googleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "select_account" } },
    })
  );
}

export const authOptions = {
  session: { strategy: "jwt", maxAge: REFRESH_SEC },
  pages: { signIn: "/login", error: "/login" },
  providers,
  callbacks: {
    // Google: find the account by Google id or (verified) email, link it, or create a new customer account.
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      if (!profile?.email || profile.email_verified === false) return "/login?error=GoogleEmail";
      await dbConnect();
      const email = profile.email.toLowerCase();
      let u = await User.findOne({ $or: [{ googleId: account.providerAccountId }, { email }] });
      if (!u) {
        u = await User.create({ name: profile.name || email.split("@")[0], email, googleId: account.providerAccountId, image: profile.picture || "" });
        log.info("auth.signup", { userId: u._id.toString(), method: "google" });
      } else if (!u.googleId) {
        u.googleId = account.providerAccountId;
        if (!u.image && profile.picture) u.image = profile.picture;
        await u.save();
        log.info("auth.google_linked", { userId: u._id.toString() });
      }
      log.info("auth.login", { userId: u._id.toString(), method: "google" });
      // Hand our own user record to the jwt callback below.
      Object.assign(user, { id: u._id.toString(), name: u.name, email: u.email, phone: u.phone || "", role: u.role, image: u.image });
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Fresh sign-in: start a refresh token family.
        const { refresh, family } = await issueRefresh(user.id);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone || "";
        token.role = user.role;
        token.picture = user.image || token.picture;
        token.rt = refresh;
        token.rf = family;
        token.ax = Math.floor(Date.now() / 1000) + ACCESS_SEC;
        delete token.err;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.phone) token.phone = session.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (sessionExpired(token)) return { expires: session.expires, error: "SessionExpired" };
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.role = token.role;
      // Google photo, else Gravatar when the email has one (d=404 means "no picture", and the header shows the initial instead).
      if (!session.user.image && session.user.email) {
        const hash = crypto.createHash("sha256").update(session.user.email.trim().toLowerCase()).digest("hex");
        session.user.image = `https://gravatar.com/avatar/${hash}?s=96&d=404`;
      }
      return session;
    },
  },
  events: {
    // Logging out kills this sign-in's refresh tokens, so a copied cookie stops working too.
    async signOut({ token }) {
      await revokeFamily(token?.rf).catch(() => {});
      if (token?.id) log.info("auth.logout", { userId: token.id });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Signed-in session, or null (also null when the session expired and couldn't be refreshed).
export async function getSession() {
  const s = await getServerSession(authOptions);
  return s?.user?.id ? s : null;
}

export async function requireAdmin() {
  const session = await getSession();
  return session?.user?.role === "admin" ? session : null;
}
