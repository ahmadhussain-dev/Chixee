import { NextResponse } from "next/server";

export const ok = (data, init) => NextResponse.json(data, init);
export const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

export function handle(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error(e);
      return fail(e.message?.includes("MONGODB_URI") ? e.message : "Something went wrong. Please try again.", 500);
    }
  };
}
