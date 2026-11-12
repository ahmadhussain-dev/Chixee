import crypto from "node:crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { normalizePhone } from "@/lib/validate";
import { rateLimit } from "@/lib/rateLimit";
import { log } from "@/lib/log";

export const TOO_MANY = "TooManyAttempts";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
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
        const query = id.includes("@") ? { email: id } : { phone: normalizePhone(id) };
        const user = await User.findOne(query).select("+password");
        const ok = user ? await bcrypt.compare(password, user.password) : false;
        if (!ok) {
          log.warn("auth.login_failed", { by: id.includes("@") ? "email" : "phone" });
          return null;
        }
        log.info("auth.login", { userId: user._id.toString() });
        return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.phone) token.phone = session.phone;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.role = token.role;
      // Profile picture from Gravatar when the email has one (d=404 means "no picture", and the header shows the initial instead).
      if (!session.user.image && session.user.email) {
        const hash = crypto.createHash("sha256").update(session.user.email.trim().toLowerCase()).digest("hex");
        session.user.image = `https://gravatar.com/avatar/${hash}?s=96&d=404`;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getSession = () => getServerSession(authOptions);

export async function requireAdmin() {
  const session = await getSession();
  return session?.user?.role === "admin" ? session : null;
}
