"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { BadgePercent, Bike, ChevronRight, Clock, Info, LogIn, Menu, Package, Phone, UserPlus, UtensilsCrossed, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import useScrollLock from "@/hooks/useScrollLock";
import { SITE } from "@/data/site";

// Phone/tablet menu: ☰ in the header opens a side panel with the site's pages.
// Guests get Login / Register here (the header only has room for the Delivery/Pickup switch).
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => setMounted(true), []);
  const { data: session } = useSession();
  const pathname = usePathname();
  useScrollLock(open);

  // Close on Escape and whenever the page changes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the panel after navigating
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    ["/#menu", UtensilsCrossed, "Menu", "Broast, burgers, pizza, chai"],
    ["/deals", BadgePercent, "Hot Deals", "Combos and today's offers"],
    ["/track", Bike, "Track order", "See where your order is"],
    [session ? "/orders" : "/track#recent", Package, "My orders", session ? "All orders on your account" : "Orders placed on this phone"],
    ["/about", Info, "About us"],
    ["/contact", Phone, "Contact", `UAN ${SITE.uan}`],
  ];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="site-menu" className="grid size-10 flex-none place-items-center rounded-xl bg-white/45 text-maroon transition hover:bg-white/70 lg:hidden">
        <Menu aria-hidden="true" strokeWidth={2.4} className="size-[22px]" />
      </button>

      {/* Portalled to <body> so the panel sits above the order bar and cart button (the header is its own stacking layer) */}
      {mounted && createPortal(<>
      <div onClick={() => setOpen(false)} aria-hidden="true" className={`fixed inset-0 z-[90] bg-night/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`} />
      <nav
        id="site-menu"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[91] flex w-[min(340px,86%)] flex-col bg-white shadow-[-20px_0_50px_rgba(0,0,0,.25)] transition-[transform,visibility] duration-500 ease-brand lg:hidden ${open ? "visible translate-x-0" : "invisible translate-x-full"}`}
      >
        <div className="flex items-center gap-3 bg-yellow px-4 py-3.5">
          <Logo size={44} />
          <b className="font-display text-2xl font-normal leading-none text-maroon">CHIXEE</b>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid size-10 place-items-center rounded-xl text-maroon-dark transition hover:bg-white/50">
            <X aria-hidden="true" strokeWidth={2.4} className="size-6" />
          </button>
        </div>

        {!session && (
          <div className="grid grid-cols-2 gap-2.5 border-b border-line p-4">
            <Link href="/login" className="flex items-center justify-center gap-1.5 rounded-full border-2 border-maroon py-2.5 text-sm font-bold text-maroon"><LogIn aria-hidden="true" className="size-4" />Login</Link>
            <Link href="/signup" className="flex items-center justify-center gap-1.5 rounded-full bg-maroon py-2.5 text-sm font-bold text-white shadow-[0_6px_14px_rgba(140,22,29,.28)]"><UserPlus aria-hidden="true" className="size-4" />Register</Link>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto overscroll-contain">
          {links.map(([href, Ico, label, sub]) => (
            <li key={label}>
              <Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 border-b border-line px-4 py-3 transition hover:bg-cream">
                <span className="grid size-10 flex-none place-items-center rounded-xl bg-yellow-soft text-[#A3161B]"><Ico aria-hidden="true" strokeWidth={1.8} className="size-[22px]" /></span>
                <span className="min-w-0 leading-tight">
                  <b className="block font-semibold">{label}</b>
                  {sub && <small className="block truncate text-[12.5px] text-muted">{sub}</small>}
                </span>
                <ChevronRight aria-hidden="true" className="ml-auto size-4 flex-none text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 border-t border-line px-4 py-3.5 text-[13px] text-muted">
          <Clock aria-hidden="true" className="size-4 flex-none text-maroon" />
          Open every day till 2 AM
          <a href={`tel:${SITE.uan.replace(/\D/g, "")}`} className="ml-auto rounded-full bg-yellow px-3 py-1.5 font-bold text-maroon-dark">Call</a>
        </div>
      </nav>
      </>, document.body)}
    </>
  );
}
