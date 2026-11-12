import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { log } from "@/lib/log";

export const ok = (data, init) => NextResponse.json(data, init);
export const fail = (message, status = 400, headers) => NextResponse.json({ error: message }, { status, headers });

// Throw from anywhere inside a handler to send that status and message.
export class HttpError extends Error {
  constructor(status, message, headers) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

// Request body as JSON; a missing or broken body is a 400, not a server error.
export async function readJson(req) {
  try {
    const b = await req.json();
    if (b && typeof b === "object" && !Array.isArray(b)) return b;
  } catch {}
  throw new HttpError(400, "The request body must be a JSON object.");
}

export const clientIp = (req) =>
  (req?.headers?.get("x-forwarded-for") || "").split(",")[0].trim() || req?.headers?.get("x-real-ip") || "unknown";

/**
 * Wraps a route handler with:
 * - authentication / authorization: { auth: "user" } needs a signed-in user (else 401),
 *   { auth: "admin" } also needs the admin role (403 for other accounts);
 * - error handling: HttpError -> its status, anything else -> logged 500 with a generic message;
 * - a request id (from proxy.js, or a new one) on the response and in the logs;
 * - one log line per request with method, path, status, duration and user.
 * The handler gets (req, ctx, { session, requestId }).
 */
export function route(fn, { auth } = {}) {
  return async (req, ctx) => {
    const started = Date.now();
    const requestId = req?.headers?.get("x-request-id") || crypto.randomUUID();
    const path = req?.nextUrl?.pathname;
    let session = null;
    let res;
    try {
      if (auth) {
        session = await getSession();
        if (!session) throw new HttpError(401, "Please sign in.");
        if (auth === "admin" && session.user?.role !== "admin") throw new HttpError(403, "Admins only.");
      }
      res = await fn(req, ctx, { session, requestId });
    } catch (e) {
      if (e instanceof HttpError) res = fail(e.message, e.status, e.headers);
      else {
        log.error("api.unhandled", { requestId, method: req?.method, path, error: e.message, stack: e.stack });
        res = e.message?.includes("MONGODB_URI") ? fail("The database isn't configured.", 503) : fail("Something went wrong. Please try again.", 500);
      }
    }
    try { res.headers.set("x-request-id", requestId); } catch {}
    const status = res.status;
    const entry = { requestId, method: req?.method, path, status, ms: Date.now() - started, user: session?.user?.id };
    if (status >= 500) log.error("api.request", entry);
    else if (status >= 400) log.warn("api.request", entry);
    else log.info("api.request", entry);
    return res;
  };
}

// Older name kept for routes without auth.
export const handle = (fn) => route(fn);
