"use client";
import Link from "next/link";
import { useState } from "react";
import { FormError, FormSuccess } from "@/components/auth/AuthCard";

export default function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const email = new FormData(e.currentTarget).get("email");
    const r = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setBusy(false);
    if (!r.ok) return setError("Couldn't send the email. Please try again.");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid gap-4">
        <FormSuccess>If an account exists for that email, we&apos;ve sent a link to reset your password. It works for 30 minutes.</FormSuccess>
        <Link href="/login" className="btn-yellow w-full">Back to sign in</Link>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <FormError>{error}</FormError>
      <label className="label">Email<input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className="input" /></label>
      <button disabled={busy} className="btn-yellow mt-1.5 w-full">{busy ? "Sending…" : "Send reset link"}</button>
      <p className="mt-1 text-center text-[13px] text-muted">Remembered it? <Link href="/login" className="font-bold text-maroon">Sign in</Link></p>
    </form>
  );
}
