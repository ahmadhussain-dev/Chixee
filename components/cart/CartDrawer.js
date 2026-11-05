"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ItemThumb from "@/components/menu/ItemThumb";
import PopularItems from "@/components/checkout/PopularItems";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { formatPKR } from "@/data/menu";
import { SITE } from "@/data/site";
import useScrollLock from "@/hooks/useScrollLock";

export default function CartDrawer() {
  const { lines, subtotal, count, setLineQty, clear, drawerOpen, setDrawerOpen } = useCart();
  const { location, setModalOpen } = useLocation();
  const router = useRouter();
  const closeRef = useRef(null);
  const pickup = location?.type === "pickup";
  const fee = !pickup && location?.area ? location.area.fee : null;

  useScrollLock(drawerOpen);
  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[70] bg-night/50 backdrop-blur-[2px] transition-all duration-300 ${drawerOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      />
      {/* Clipping wrapper keeps the off-screen drawer from widening the page on mobile */}
      <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <aside
        aria-label="Your cart"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={`pointer-events-auto absolute inset-y-0 right-0 flex w-[min(420px,100%)] flex-col bg-white shadow-[-20px_0_50px_rgba(0,0,0,.18)] transition-[transform,visibility] duration-500 ease-brand ${drawerOpen ? "visible translate-x-0" : "invisible translate-x-[105%]"}`}
      >
        <div className="flex items-center gap-3 border-b border-line bg-cream px-5 py-4">
          <h2 className="heading mr-auto text-[24px]">Your Cart</h2>
          {!!count && (
            <button type="button" onClick={clear} className="rounded-lg px-2 py-1.5 text-sm font-semibold text-maroon underline-offset-4 hover:underline">
              Clear cart
            </button>
          )}
          <button ref={closeRef} type="button" aria-label="Close cart" onClick={() => setDrawerOpen(false)} className="grid size-10 place-items-center rounded-[10px] transition duration-300 hover:rotate-90 hover:bg-cream">
            <Icon name="x" className="size-[22px]" />
          </button>
        </div>

        <button type="button" onClick={() => setModalOpen(true)} className="mx-5 mt-4 flex items-center gap-2.5 rounded-xl bg-yellow-soft px-3.5 py-3 text-left text-[13.5px] text-maroon-dark">
          <Icon name={pickup ? "store" : "bike"} className="size-5 flex-none" />
          <span className="flex-1">
            {pickup ? (
              <>Pick up from <b>{SITE.branch.name}</b>, {SITE.branch.street}</>
            ) : location?.area ? (
              <>Delivering to <b>{location.area.name}</b> · about {location.area.eta} min</>
            ) : (
              <>Choose your delivery area</>
            )}
          </span>
          <span className="font-semibold underline">Change</span>
        </button>

        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-2">
          {!lines.length ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-8 text-center text-muted">
              <Icon name="bag" className="size-[72px] animate-float text-yellow" />
              <b className="text-[17px] text-ink">Your cart is empty</b>
              Add a broast or two and it will show up here.
            </div>
          ) : (
            <>
              {lines.map((l) => (
                <div key={l.key} className="grid animate-slidein grid-cols-[56px_1fr] gap-3 border-b border-line py-3.5">
                  <div className="relative size-14 overflow-hidden rounded-xl bg-yellow"><ItemThumb item={l.item} small sizes="56px" /></div>
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-bold uppercase leading-snug">{l.item.n}</h3>
                    {l.size && Object.keys(l.item.sizes || {}).length > 1 && <p className="text-[13px] text-muted">{l.size}</p>}
                    {l.note && <p className="truncate text-xs italic text-muted">“{l.note}”</p>}
                    <p className="text-right text-[15px] font-bold tabular-nums">{formatPKR(l.total)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button type="button" aria-label={`Remove one ${l.item.n}`} onClick={() => setLineQty(l.key, l.qty - 1)} className="grid size-8 place-items-center rounded-full bg-maroon text-lg leading-none text-white transition hover:bg-maroon-dark">−</button>
                      <output className="grid h-8 min-w-9 place-items-center rounded-lg px-2 text-sm font-bold tabular-nums ring-1 ring-line">{l.qty}</output>
                      <button type="button" aria-label={`Add one ${l.item.n}`} onClick={() => setLineQty(l.key, l.qty + 1)} className="grid size-8 place-items-center rounded-full bg-maroon text-lg leading-none text-white transition hover:bg-maroon-dark">+</button>
                      <button type="button" aria-label={`Remove ${l.item.n} from cart`} onClick={() => setLineQty(l.key, 0)} className="ml-auto grid size-9 place-items-center rounded-lg text-muted transition hover:bg-cream hover:text-maroon">
                        <Icon name="trash" className="size-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pb-2">
                <PopularItems />
              </div>
            </>
          )}
        </div>

        <div className="grid gap-2.5 border-t border-line px-5 py-4">
          <div className="flex justify-between text-sm tabular-nums text-muted"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
          {!pickup && (
            <div className="flex justify-between text-sm tabular-nums text-muted"><span>Delivery Charges</span><span>{fee === null ? "Choose area" : formatPKR(fee)}</span></div>
          )}
          <div className="flex justify-between border-t border-line pt-2.5 text-lg font-bold tabular-nums"><span>Grand total</span><span>{formatPKR(subtotal + (fee || 0))}</span></div>
          <button
            type="button"
            disabled={!count}
            onClick={() => {
              setDrawerOpen(false);
              router.push("/checkout");
            }}
            className="btn-maroon w-full py-4 text-base"
          >
            Checkout
          </button>
        </div>
      </aside>
      </div>
    </>
  );
}
