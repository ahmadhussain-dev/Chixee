"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";

// Sign out, then go to the home page of whichever site this is (Vercel, custom domain or localhost).
// next-auth's own redirect builds the URL from NEXTAUTH_URL, which sent Vercel users to localhost.
const logout = () => signOut({ redirect: false }).then(() => window.location.assign("/"));

const LINKS = [
  ["/admin", "list", "Orders"],
  ["/admin/menu", "bag", "Menu items"],
  ["/admin/deals", "box", "Deals"],
  ["/admin/reports", "chart", "Reports"],
  ["/admin/areas", "pin", "Delivery areas"],
  ["/admin/settings", "gear", "Payment & store"],
];

// Phone/tablet header buttons: back to the site and sign out (the sidebar shows them on desktop).
export function AdminActions() {
  const btn = "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-bold transition";
  return (
    <div className="ml-auto flex items-center gap-2 md:hidden">
      <Link href="/" className={`${btn} bg-yellow text-maroon-dark hover:bg-white`}><Icon name="store" className="size-4" />Home</Link>
      <button type="button" onClick={() => logout()} className={`${btn} bg-white/10 text-on-night hover:bg-white/20`}><Icon name="logout" className="size-4" />Logout</button>
    </div>
  );
}

export default function AdminNav({ name }) {
  const path = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0" aria-label="Admin">
      {LINKS.map(([href, icon, label]) => {
        const on = path === href;
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}
            className={`flex flex-none items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition md:gap-3 md:rounded-xl md:px-4 md:py-3 md:text-base ${on ? "bg-yellow text-maroon-dark" : "text-on-night hover:bg-night-2"}`}>
            <Icon name={icon} className="size-4 md:size-5" />{label}
          </Link>
        );
      })}
      <div className="mt-2 hidden border-t border-white/10 pt-3 md:block">
        <p className="px-4 pb-2 text-sm text-on-night-muted">Signed in as {name}</p>
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-on-night hover:bg-night-2"><Icon name="store" className="size-5" />View site</Link>
        <button type="button" onClick={() => logout()} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-on-night hover:bg-night-2"><Icon name="logout" className="size-5" />Sign out</button>
      </div>
    </nav>
  );
}
