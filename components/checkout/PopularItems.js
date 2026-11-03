"use client";
import { useRef } from "react";
import Icon from "@/components/ui/Icon";
import ItemThumb from "@/components/menu/ItemThumb";
import { POPULAR, formatPKR, fromPrice } from "@/data/menu";
import { useItemModal } from "@/context/ItemModalContext";

export default function PopularItems() {
  const ref = useRef(null);
  const { openItem } = useItemModal();
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
          return (
            <div key={item.id} className="group relative flex w-[85%] flex-none snap-start gap-3 rounded-2xl border border-line bg-white p-3 sm:w-[300px]">
              <button type="button" onClick={() => openItem(item.id)} aria-label={`${item.n}. View options and add to cart`} className="absolute inset-0 z-[1] cursor-pointer rounded-2xl" />
              <div className="relative size-24 flex-none overflow-hidden rounded-xl bg-yellow">
                <ItemThumb item={item} small sizes="96px" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <b className="text-[15px] leading-tight">{item.n}</b>
                <p className="line-clamp-2 text-xs uppercase text-muted">{item.d}</p>
                <span aria-hidden="true" className="mt-auto w-fit rounded-lg bg-maroon px-3 py-1.5 text-sm font-bold text-white transition group-hover:bg-maroon-dark">
                  {item.sizes && Object.keys(item.sizes).length > 1 ? "from " : ""}{formatPKR(fromPrice(item))} +
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
