"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/auth/PasswordInput";
import { FormError, FormSuccess } from "@/components/auth/AuthCard";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const notice = params.get("reset") ? "Password updated. Sign in with your new password." : params.get("registered") ? "Account created. Please sign in." : "";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const res = await signIn("credentials", { identifier: f.get("identifier"), password: f.get("password"), redirect: false });
    setBusy(false);
    if (res?.error === "TooManyAttempts") return setError("Too many sign-in attempts. Please wait 15 minutes and try again.");
    if (res?.error) return setError("Wrong email/mobile or password.");
    router.push(next.startsWith("/") ? next : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <FormSuccess>{notice}</FormSuccess>
      <FormError>{error}</FormError>
      <label className="label">Email or mobile number<input name="identifier" required autoComplete="username" placeholder="you@email.com or 03XX XXXXXXX" className="input" /></label>
      <div className="label">
        <span className="flex justify-between"><label htmlFor="password">Password</label><Link href="/forgot-password" className="font-semibold text-maroon hover:underline">Forgot password?</Link></span>
        <PasswordInput id="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
      </div>
      <button disabled={busy} className="btn-yellow mt-1.5 w-full">{busy ? "Signing in…" : "Sign In"}</button>
      <p className="mt-1 text-center text-[13px] text-muted">New to Chixee? <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-maroon">Create an account</Link></p>
    </form>
  );
}
