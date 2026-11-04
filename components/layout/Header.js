"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useLocation } from "@/context/LocationContext";
import { SITE } from "@/data/site";

function ModeToggle() {
  const { location, setType } = useLocation();
  const mode = location?.type || "delivery";
  return (
    <div role="group" aria-label="Order type" className="relative flex flex-none rounded-full bg-white p-1 shadow-[inset_0_0_0_1px_rgba(107,13,17,.08)] sm:p-[5px]">
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full sm:inset-y-[5px] sm:left-[5px] sm:w-[calc(50%-5px)] bg-maroon shadow-[0_6px_14px_rgba(163,22,27,.3)] transition-transform duration-500 ease-brand ${mode === "pickup" ? "translate-x-full" : ""}`}
      />
      {[
        ["delivery", "bike", "Delivery"],
        ["pickup", "store", "Pickup"],
      ].map(([key, icon, label]) => (
        <button
          key={key}
          type="button"
          aria-pressed={mode === key}
          onClick={() => setType(key)}
          className={`relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-5 sm:py-2 sm:text-base ${mode === key ? "text-white" : "text-maroon"}`}
        >
          <Icon name={icon} className="hidden size-4 min-[400px]:block sm:size-5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function LocationChip() {
  const { location, setModalOpen } = useLocation();
  const label =
    location?.type === "pickup" ? SITE.branch.name : location?.area ? location.area.name : "Choose your area";
  return (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl px-1.5 py-1 text-left text-maroon transition hover:bg-white/45 sm:gap-2 sm:px-3 sm:py-2 lg:max-w-[220px] lg:flex-none"
      aria-label={`Change location. Current: ${label}`}
    >
      <Icon name="pin" className="size-5 flex-none sm:size-6" />
      <span className="min-w-0 leading-tight">
        <small className="hidden text-[11px] font-semibold uppercase tracking-wide text-maroon-dark/70 sm:block">
          {location?.type === "pickup" ? "Pickup from" : "Delivery location"}
        </small>
        <b className="block truncate text-[13px] sm:text-sm">{label}</b>
      </span>
      <Icon name="down" className="size-4 flex-none" />
    </button>
  );
}

// Round avatar: the user's profile photo if they have one, otherwise the first letter of their name on maroon.
function Avatar({ user }) {
  const [broken, setBroken] = useState(false);
  const letter = (user.name || user.email || "?").trim()[0]?.toUpperCase();
  return (
    <span className="relative grid size-10 flex-none place-items-center overflow-hidden rounded-full bg-maroon font-display text-xl leading-none text-yellow ring-2 ring-white shadow-[0_4px_12px_rgba(107,13,17,.25)]">
      {letter}
      {user.image && !broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" width={40} height={40} referrerPolicy="no-referrer" onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover" />
      )}
    </span>
  );
}

function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (status === "loading") return <span className="order-2 h-[46px] w-[110px] md:order-none animate-pulse rounded-xl bg-white/40" />;
  if (!session) {
    return (
      <div className="order-2 flex flex-none items-center gap-1 sm:gap-2 lg:order-none">
        <Link href="/login" className="rounded-full px-3 py-2 font-semibold text-maroon underline-offset-4 transition hover:underline">
          Login
        </Link>
        <Link href="/signup" className="rounded-full bg-maroon px-4 py-2 font-semibold text-white shadow-[0_6px_14px_rgba(140,22,29,.28)] transition hover:-translate-y-0.5 hover:bg-maroon-dark sm:px-5 sm:py-2.5">
          Register
        </Link>
      </div>
    );
  }
  const first = session.user.name?.split(" ")[0] || "Account";
  return (
    <div ref={ref} className="relative order-2 md:order-none">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`Account menu for ${first}`} className="flex items-center gap-2 rounded-full p-0.5 pr-2 font-semibold text-maroon transition hover:bg-white/45 sm:pr-3">
        <Avatar user={session.user} />
        <span className="hidden max-w-[90px] truncate sm:inline">{first}</span>
        <Icon name="down" className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 animate-pop overflow-hidden rounded-2xl bg-white py-2 shadow-[0_20px_50px_rgba(0,0,0,.18)]">
          <div className="flex items-center gap-3 border-b border-line px-4 pb-3 pt-1.5">
            <Avatar user={session.user} />
            <span className="min-w-0 leading-tight"><b className="block truncate">{session.user.name}</b><small className="block truncate text-muted">{session.user.email}</small></span>
          </div>
          <Link href="/orders" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream"><Icon name="box" className="size-[18px] text-maroon" />My orders</Link>
          {session.user.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream"><Icon name="gear" className="size-[18px] text-maroon" />Admin panel</Link>
          )}
          <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-cream"><Icon name="logout" className="size-[18px] text-maroon" />Sign out</button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="relative z-50 bg-yellow">
      <div className="wrap flex flex-wrap items-center gap-x-3 gap-y-2.5 py-2.5 sm:py-3 lg:min-h-[92px] lg:flex-nowrap lg:gap-5">
        <Link href="/" className="group mr-auto flex items-center gap-3 text-maroon" aria-label="Chixee home">
          <Logo size={52} priority className="shadow-[0_6px_18px_rgba(107,13,17,.18)] transition-transform duration-700 ease-brand group-hover:-rotate-12 group-hover:scale-105" />
          <span>
            <b className="block font-display text-2xl leading-none tracking-wide md:text-[28px]">CHIXEE</b>
            <small className="hidden font-script text-[19px] leading-none text-maroon-dark sm:block">{SITE.tagline}</small>
          </span>
        </Link>
        <div className="order-3 flex w-full items-center gap-2 rounded-2xl bg-white/40 p-1.5 sm:gap-3 lg:contents">
          <LocationChip />
          <ModeToggle />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
