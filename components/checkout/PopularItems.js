"use client";
import { useRef } from "react";
import Icon from "@/components/ui/Icon";
import ItemThumb from "@/components/menu/ItemThumb";
import { POPULAR, defaultSize, formatPKR, priceOf } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function PopularItems() {
  const ref = useRef(null);
  const { add } = useCart();
  const toast = useToast();
  const scroll = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">Popular Items</h3>
        <div className="flex gap-2">
          <button type="button" aria-label="Scroll left" onClick={() => scroll(-1)} className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-maroon"><Icon name="left" className="size-4" /></button>
          <button type="button" aria-label="Scroll right" onClick={() => scroll(1)} className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-maroon"><Icon name="right" className="size-4" /></button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-1 relative">
        {POPULAR.map((item) => {
          const size = defaultSize(item);
          return (
            <div key={item.id} className="group relative flex w-[85%] flex-none snap-start gap-3 rounded-2xl border border-line bg-white p-3 sm:w-[300px]">
              <div className="relative size-24 flex-none overflow-hidden rounded-xl bg-yellow">
                <ItemThumb item={item} small sizes="96px" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <b className="text-[15px] leading-tight">{item.n}</b>
                <p className="line-clamp-2 text-xs uppercase text-muted">{item.d}</p>
                <button type="button" onClick={() => { add(item.id, size); toast(`${item.n} added to cart`); }}
                  className="mt-auto w-fit rounded-lg bg-maroon px-3 py-1.5 text-sm font-bold text-white transition hover:bg-maroon-dark">
                  {formatPKR(priceOf(item, size))} <span aria-hidden="true">+</span><span className="sr-only">Add to cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
