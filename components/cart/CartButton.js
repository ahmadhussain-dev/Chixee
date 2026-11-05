"use client";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/data/menu";
import useFooterGap from "@/hooks/useFooterGap";

// Fixed bottom-right cart button with live item count. Hidden while the cart is empty.
export default function CartButton() {
  const { count, subtotal, setDrawerOpen, bump } = useCart();
  const pathname = usePathname();
  const footerGap = useFooterGap();
  if (pathname === "/checkout") return null; // the cart is already on the page
  const show = count > 0;

  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{ marginBottom: `calc(${footerGap}px + var(--bottom-bar-h, 0px))` }}
      className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-[max(16px,env(safe-area-inset-right))] z-[60] flex items-center gap-3 rounded-full bg-maroon py-2 pl-2 pr-5 text-white shadow-[0_14px_34px_rgba(107,13,17,.4)] transition duration-500 ease-brand hover:-translate-y-1 hover:bg-maroon-dark sm:bottom-[max(20px,env(safe-area-inset-bottom))] sm:right-[max(20px,env(safe-area-inset-right))] ${show ? "visible translate-y-0 opacity-100" : "invisible translate-y-24 opacity-0"}`}
    >
      {/* key changes on every add, which replays the bump animation */}
      <span key={bump} className={`relative grid size-12 place-items-center rounded-full bg-yellow text-maroon-dark ${bump ? "animate-bump" : ""}`}>
        <Icon name="bag" className="size-6" />
        <span className="absolute -right-1 -top-1 grid h-[22px] min-w-[22px] place-items-center rounded-full border-2 border-maroon bg-white px-1.5 text-xs font-bold text-maroon">
          {count}
        </span>
      </span>
      <span className="text-left leading-tight">
        <small className="block text-[11px] font-semibold uppercase tracking-wide text-white/75">{count} item{count === 1 ? "" : "s"}</small>
        <b className="tabular-nums">{formatPKR(subtotal)}</b>
      </span>
    </button>
  );
}
