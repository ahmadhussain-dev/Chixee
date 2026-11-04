import crypto from "node:crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { normalizePhone } from "@/lib/validate";

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
      async authorize(credentials) {
        const id = (credentials?.identifier || "").trim().toLowerCase();
        const password = credentials?.password || "";
        if (!id || !password) return null;
        await dbConnect();
        const query = id.includes("@") ? { email: id } : { phone: normalizePhone(id) };
        const user = await User.findOne(query).select("+password");
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
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
