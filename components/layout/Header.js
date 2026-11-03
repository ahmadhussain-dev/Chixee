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
    <div role="group" aria-label="Order type" className="relative order-4 flex w-full rounded-full bg-white p-[5px] shadow-[inset_0_0_0_1px_rgba(107,13,17,.08)] lg:order-none lg:w-auto">
      <span
        aria-hidden="true"
        className={`absolute inset-y-[5px] left-[5px] w-[calc(50%-5px)] rounded-full bg-maroon shadow-[0_6px_14px_rgba(163,22,27,.3)] transition-transform duration-500 ease-brand ${mode === "pickup" ? "translate-x-full" : ""}`}
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
          className={`relative z-[1] flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold transition-colors lg:flex-none ${mode === key ? "text-white" : "text-maroon"}`}
        >
          <Icon name={icon} />
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
      className="order-3 flex max-w-full items-center gap-2 rounded-xl px-3 py-2 text-left md:order-none md:max-w-[220px] text-maroon transition hover:bg-white/45"
      aria-label={`Change location. Current: ${label}`}
    >
      <Icon name="pin" className="size-6 flex-none" />
      <span className="min-w-0 leading-tight">
        <small className="block text-[11px] font-semibold uppercase tracking-wide text-maroon-dark/70">
          Your location
        </small>
        <b className="block truncate text-sm">{label}</b>
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
      <div className="wrap flex flex-wrap items-center gap-3 py-3 lg:min-h-[92px] lg:flex-nowrap lg:gap-5">
        <Link href="/" className="group mr-auto flex items-center gap-3 text-maroon" aria-label="Chixee home">
          <Logo size={60} priority className="shadow-[0_6px_18px_rgba(107,13,17,.18)] transition-transform duration-700 ease-brand group-hover:-rotate-12 group-hover:scale-105" />
          <span>
            <b className="block font-display text-2xl leading-none tracking-wide md:text-[28px]">CHIXEE</b>
            <small className="hidden font-script text-[19px] leading-none text-maroon-dark sm:block">{SITE.tagline}</small>
          </span>
        </Link>
        <LocationChip />
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
