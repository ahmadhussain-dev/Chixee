import { NextResponse } from "next/server";
import { encode, getToken } from "next-auth/jwt";
import { ACCESS_SEC, REFRESH_SEC, rotateRefresh } from "@/lib/tokens";
import { log } from "@/lib/log";

// Runs before every page and API call:
// 1. gives each request an id (x-request-id) that the API logs and returns, so a customer's error can be traced;
// 2. refreshes the session: when the 15-minute access window has passed, swaps the refresh token for a new one
//    (lib/tokens.js) and writes the new session cookie. Done here because pages can't set cookies themselves.
//    If the refresh token was revoked or reused, the session cookie is cleared (signed out);
// 3. keeps signed-out visitors and non-admin accounts out of /admin and /api/admin before any page or database work.
//    Each admin route still checks the role itself (route({ auth: "admin" }) in lib/api.js), so this is a second lock.

const secret = process.env.NEXTAUTH_SECRET;
const EARLY_SEC = 60; // refresh a minute before the access window ends

function cookieNameFor(req) {
  const secure = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL.startsWith("https://") : req.nextUrl.protocol === "https:";
  return { name: `${secure ? "__Secure-" : ""}next-auth.session-token`, secure };
}

// Replaces (or removes) the session cookie in the request the app is about to see.
function withCookie(headers, name, value) {
  const rest = (headers.get("cookie") || "")
    .split(/;\s*/)
    .filter((c) => c && !c.startsWith(`${name}=`) && !c.startsWith(`${name}.`));
  if (value) rest.push(`${name}=${value}`);
  headers.set("cookie", rest.join("; "));
}

export async function proxy(req) {
  const headers = new Headers(req.headers);
  const requestId = headers.get("x-request-id") || crypto.randomUUID();
  headers.set("x-request-id", requestId);
  const { pathname } = req.nextUrl;
  const { name: cookieName, secure } = cookieNameFor(req);

  let token = secret ? await getToken({ req, secret, secureCookie: secure }) : null;
  let setCookie = null; // { value } to write, or { value: "" } to clear

  if (token?.rt && !token.err && Date.now() / 1000 > (token.ax || 0) - EARLY_SEC) {
    try {
      const r = await rotateRefresh(token.rt);
      if (r.error) {
        log.info("auth.session_ended", { requestId, userId: token.id, reason: r.error });
        token = null;
        setCookie = { value: "" };
      } else {
        token = { ...token, ...r.user, rt: r.refresh, ax: Math.floor(Date.now() / 1000) + ACCESS_SEC };
        setCookie = { value: await encode({ token, secret, maxAge: REFRESH_SEC }) };
      }
    } catch (e) {
      // Database hiccup: keep the current session; the next request tries again.
      log.error("auth.refresh_failed", { requestId, error: e.message });
    }
  } else if (token && !token.rt) {
    // Session from before refresh tokens existed: sign it out once.
    token = null;
    setCookie = { value: "" };
  }
  if (setCookie) withCookie(headers, cookieName, setCookie.value);

  const finish = (res) => {
    res.headers.set("x-request-id", requestId);
    if (setCookie?.value) {
      res.cookies.set(cookieName, setCookie.value, { httpOnly: true, sameSite: "lax", path: "/", secure, maxAge: REFRESH_SEC });
    } else if (setCookie) {
      res.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", path: "/", secure, maxAge: 0 });
    }
    return res;
  };

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isApi = pathname.startsWith("/api/");
    if (!token) {
      if (isApi) return finish(NextResponse.json({ error: "Please sign in." }, { status: 401 }));
      const login = new URL("/login", req.url);
      login.searchParams.set("next", pathname);
      return finish(NextResponse.redirect(login));
    }
    if (token.role !== "admin" && isApi) return finish(NextResponse.json({ error: "Admins only." }, { status: 403 }));
    // A signed-in customer opening /admin sees the friendly "Admins only" page from app/admin/layout.js.
  }

  return finish(NextResponse.next({ request: { headers } }));
}

export const config = {
  // Everything except static files, images and the service worker.
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico|icon.png|apple-icon.png|sw.js|manifest.webmanifest|robots.txt|sitemap.xml).*)"],
};
