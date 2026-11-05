"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/auth/PasswordInput";
import { FormError } from "@/components/auth/AuthCard";

export default function SignupForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (f.password !== f.confirm) return setError("Passwords don't match.");
    setBusy(true);
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      setBusy(false);
      return setError(data.error || "Couldn't create your account.");
    }
    const res = await signIn("credentials", { identifier: f.email, password: f.password, redirect: false });
    setBusy(false);
    if (res?.error) return router.push("/login?registered=1");
    router.push(next.startsWith("/") ? next : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2.5 sm:gap-3 [&_.input]:py-2.5 sm:[&_.input]:py-3">
      <FormError>{error}</FormError>
      <label className="label">Full name<input name="name" required minLength={2} autoComplete="name" placeholder="Your name" className="input" /></label>
      <label className="label">Mobile number<input name="phone" type="tel" required autoComplete="tel" placeholder="03XX XXXXXXX" className="input" /></label>
      <label className="label">Email<input name="email" type="email" required autoComplete="email" placeholder="you@email.com" className="input" /></label>
      {/* Side by side so the whole form fits one phone screen */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className="label">Password<PasswordInput name="password" required minLength={8} autoComplete="new-password" placeholder="8+ characters" /></label>
        <label className="label">Confirm password<PasswordInput name="confirm" required minLength={8} autoComplete="new-password" placeholder="Type it again" /></label>
      </div>
      <button disabled={busy} className="btn-yellow mt-1.5 w-full">{busy ? "Creating account…" : "Create Account"}</button>
      <p className="mt-1 text-center text-[13px] text-muted">Already have an account? <Link href="/login" className="font-bold text-maroon">Sign in</Link></p>
    </form>
  );
}
