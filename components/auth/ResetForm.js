"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/auth/PasswordInput";
import { FormError } from "@/components/auth/AuthCard";

export default function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const email = params.get("email");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!token || !email) {
    return (
      <div className="grid gap-4">
        <FormError>This reset link is incomplete. Please request a new one.</FormError>
        <Link href="/forgot-password" className="btn-yellow w-full">Request a new link</Link>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (f.password !== f.confirm) return setError("Passwords don't match.");
    setBusy(true);
    const r = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, email, password: f.password }) });
    const data = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(data.error || "Couldn't reset your password.");
    router.push("/login?reset=1");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <FormError>{error}</FormError>
      {error.includes("expired") && <Link href="/forgot-password" className="text-sm font-bold text-maroon">Request a new link</Link>}
      <label className="label">New password<PasswordInput name="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></label>
      <label className="label">Confirm new password<PasswordInput name="confirm" required minLength={8} autoComplete="new-password" placeholder="Type it again" /></label>
      <button disabled={busy} className="btn-yellow mt-1.5 w-full">{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
