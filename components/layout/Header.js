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
          Your location
        </small>
        <b className="block truncate text-[13px] sm:text-sm">{label}</b>
      </span>
      <Icon name="down" className="size-4 flex-none" />
    </button>
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
      <Link href="/login" className="order-2 rounded-xl md:order-none border-2 border-maroon px-4 py-2.5 font-semibold text-maroon transition hover:-translate-y-0.5 hover:bg-maroon hover:text-white sm:px-5">
        Sign In<span className="hidden sm:inline"> / Register</span>
      </Link>
    );
  }
  const first = session.user.name?.split(" ")[0] || "Account";
  return (
    <div ref={ref} className="relative order-2 md:order-none">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-2 rounded-xl border-2 border-maroon px-3 py-2 font-semibold text-maroon transition hover:bg-white/45">
        <Icon name="user" />
        <span className="max-w-[90px] truncate">{first}</span>
        <Icon name="down" className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 animate-pop overflow-hidden rounded-2xl bg-white py-2 shadow-[0_20px_50px_rgba(0,0,0,.18)]">
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
