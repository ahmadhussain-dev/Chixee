"use client";
import Link from "next/link";
import { House, UtensilsCrossed } from "lucide-react";
import useBottomBar from "@/hooks/useBottomBar";

// Order page: a bar fixed at the bottom centre with a way back home and into the menu,
// so a customer who has just ordered isn't stuck on the tracking screen.
// It stays pinned to the bottom of the screen, even over the footer.
export default function OrderPageActions() {
  useBottomBar(true);
  return (
    <nav
      id="order-page-actions"
      aria-label="Leave order page"
      className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-0 right-0 z-[58] mx-auto flex w-[min(400px,calc(100%-32px))] animate-fade-up gap-2 rounded-[22px] bg-night p-2 ring-1 ring-white/15 shadow-[0_14px_34px_rgba(0,0,0,.35)] sm:bottom-5"
    >
      <Link href="/" className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold text-white transition hover:bg-white/10">
        <House aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
        Home
      </Link>
      <Link href="/#menu" className="flex flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-yellow px-3 py-3 text-sm font-bold text-maroon-dark transition hover:brightness-95">
        <UtensilsCrossed aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
        Explore menu
      </Link>
    </nav>
  );
}
