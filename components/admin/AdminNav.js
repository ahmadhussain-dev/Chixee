"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";

const LINKS = [
  ["/admin", "list", "Orders"],
  ["/admin/reports", "chart", "Reports"],
  ["/admin/areas", "pin", "Delivery areas"],
  ["/admin/settings", "gear", "Payment & store"],
];

export default function AdminNav({ name }) {
  const path = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0" aria-label="Admin">
      {LINKS.map(([href, icon, label]) => {
        const on = path === href;
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}
            className={`flex flex-none items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${on ? "bg-yellow text-maroon-dark" : "text-on-night hover:bg-night-2"}`}>
            <Icon name={icon} className="size-5" />{label}
          </Link>
        );
      })}
      <div className="mt-2 hidden border-t border-white/10 pt-3 md:block">
        <p className="px-4 pb-2 text-sm text-on-night-muted">Signed in as {name}</p>
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-on-night hover:bg-night-2"><Icon name="store" className="size-5" />View site</Link>
        <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-on-night hover:bg-night-2"><Icon name="logout" className="size-5" />Sign out</button>
      </div>
    </nav>
  );
}
