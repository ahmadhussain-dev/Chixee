"use client";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import useFooterGap from "@/hooks/useFooterGap";

export const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

// Floating "back to top" button, shown once the category bar is stuck. Sits above the cart button when that is visible.
export function BackToTop({ show }) {
  const { count } = useCart();
  const footerGap = useFooterGap();
  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{ marginBottom: footerGap }}
      onClick={() => window.scrollTo({ top: 0, behavior: smooth() })}
      className={`fixed right-[max(16px,env(safe-area-inset-right))] z-[55] grid size-12 place-items-center rounded-full bg-white text-maroon shadow-[0_10px_26px_rgba(34,20,15,.18)] ring-1 ring-line transition-all duration-500 ease-brand hover:-translate-y-0.5 hover:bg-yellow sm:right-[max(20px,env(safe-area-inset-right))] ${count ? "bottom-[88px] sm:bottom-[96px]" : "bottom-[max(16px,env(safe-area-inset-bottom))] sm:bottom-5"} ${show ? "visible opacity-100" : "invisible translate-y-6 opacity-0"}`}
    >
      <Icon name="left" className="size-5 rotate-90" strokeWidth={2.4} />
    </button>
  );
}

// Phones only: a search button stacked just above "back to top"; it jumps to the page's search bar.
export function SearchButton({ show, onClick, label = "Search the menu" }) {
  const { count } = useCart();
  const footerGap = useFooterGap();
  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{ marginBottom: footerGap }}
      onClick={onClick}
      className={`fixed right-[max(16px,env(safe-area-inset-right))] z-[55] grid size-12 place-items-center rounded-full bg-maroon text-yellow shadow-[0_10px_26px_rgba(107,13,17,.3)] transition-all duration-500 ease-brand hover:-translate-y-0.5 hover:bg-maroon-dark sm:hidden ${count ? "bottom-[148px]" : "bottom-[max(76px,calc(env(safe-area-inset-bottom)+60px))]"} ${show ? "visible opacity-100" : "invisible translate-y-6 opacity-0"}`}
    >
      <Icon name="search" className="size-5" strokeWidth={2.4} />
    </button>
  );
}
