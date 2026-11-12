import { NextResponse } from "next/server";
import { log } from "@/lib/log";

export const ok = (data, init) => NextResponse.json(data, init);
export const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

// Throw from anywhere inside a handler to send that status and message.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
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

export function handle(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof HttpError) return fail(e.message, e.status);
      const req = args[0];
      log.error("api.unhandled", { method: req?.method, path: req?.nextUrl?.pathname, error: e.message, stack: e.stack });
      if (e.message?.includes("MONGODB_URI")) return fail(e.message, 503);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}
