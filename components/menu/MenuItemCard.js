"use client";
import ItemThumb from "@/components/menu/ItemThumb";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useItemModal } from "@/context/ItemModalContext";
import { formatPKR, fromPrice } from "@/data/menu";

// Small pill stepper used on cards once the item is in the cart.
function CardStepper({ qty, onMinus, onPlus, name }) {
  const btn = "grid size-7 place-items-center rounded-full text-maroon ring-1 ring-maroon/25 transition hover:bg-maroon hover:text-white";
  return (
    <span className="relative z-[2] inline-flex flex-none animate-pop items-center gap-1.5 rounded-full bg-white p-1 shadow-[0_4px_12px_rgba(107,13,17,.12)] ring-1 ring-yellow">
      <button type="button" aria-label={`Remove one ${name}`} onClick={onMinus} className={btn}>
        {qty === 1 ? <Icon name="trash" className="size-3.5" /> : <span className="text-lg leading-none">−</span>}
      </button>
      <output aria-live="polite" className="min-w-4 text-center text-sm font-bold tabular-nums">{qty}</output>
      <button type="button" aria-label={`Add one more ${name}`} onClick={onPlus} className={btn}>
        <span className="text-lg leading-none">+</span>
      </button>
    </span>
  );
}

// Menu card. Tapping anywhere on it (photo, text or Add To Cart) opens the item popup.
// Once the item is in the cart the card shows a − qty + stepper and an "Added" badge instead.
export default function MenuItemCard({ item }) {
  const { lines, setLineQty, add } = useCart();
  const { openItem } = useItemModal();
  const mine = lines.filter((l) => l.id === item.id);
  const inCart = mine.reduce((s, l) => s + l.qty, 0);
  const last = mine.at(-1); // the stepper adjusts the most recently added choice
  const many = item.sizes && Object.keys(item.sizes).length > 1;
  const open = () => openItem(item.id);
  const save = item.was ? item.was - item.p : 0;

  return (
    <article className={`group relative flex gap-3.5 rounded-[18px] bg-white p-3 transition duration-300 ease-brand hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(107,13,17,.12)] sm:gap-[18px] sm:p-4 ${inCart ? "shadow-[0_0_0_1.5px_var(--color-yellow)]" : "shadow-[0_0_0_1px_var(--color-line)]"}`}>
      {/* Whole-card hit area */}
      <button type="button" onClick={open} aria-label={`${item.n}, ${many ? "from " : ""}${formatPKR(fromPrice(item))}. View options`} className="absolute inset-0 z-[1] cursor-pointer rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon" />
      <div className="relative aspect-square w-[108px] flex-none self-start overflow-hidden rounded-[14px] bg-yellow sm:w-[42%] sm:max-w-[190px]">
        <ItemThumb item={item} sizes="(max-width: 640px) 108px, 190px" />
        {save > 0 && <span className="absolute left-1.5 top-1.5 z-[3] rounded-full bg-red px-2 py-0.5 text-[10px] font-bold text-white shadow sm:left-2 sm:top-2 sm:text-[11px]">Save {formatPKR(save)}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5 sm:pt-0.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {item.tag && <span className="mb-1 inline-block rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.6px] text-yellow">{item.tag}</span>}
            {item.when && <span className="mb-1 inline-block rounded-full bg-yellow-soft px-2 py-0.5 text-[11px] font-semibold text-maroon-dark">{item.when}</span>}
            <h3 className="text-[15.5px] font-bold leading-tight text-balance sm:text-lg">{item.n}</h3>
          </div>
          {inCart > 0 && (
            <CardStepper
              name={item.n}
              qty={inCart}
              onMinus={() => setLineQty(last.key, last.qty - 1)}
              onPlus={() => add(last.id, last.size, 1, { note: last.note, ifUnavailable: last.ifUnavailable })}
            />
          )}
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-muted sm:text-[13.5px] sm:leading-normal">{item.d}</p>
        {many && !inCart && <p className="text-xs font-semibold text-maroon">{Object.keys(item.sizes).length} options</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 pt-1">
          <span className="text-[17px] font-bold tabular-nums sm:text-[19px]">
            {many && <span className="text-[13px] font-semibold text-muted">from </span>}
            {formatPKR(fromPrice(item))}
            {item.was && <s className="ml-1.5 text-[12.5px] font-medium text-muted">{formatPKR(item.was)}</s>}
          </span>
          {inCart > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ec] px-2.5 py-1 text-xs font-bold text-[#1f7a35] ring-1 ring-[#bfe6c8]">
              <Icon name="check" className="size-3.5" />
              Added
            </span>
          ) : (
            <button
              type="button"
              onClick={open}
              tabIndex={-1}
              className="relative z-[2] whitespace-nowrap rounded-[11px] bg-maroon px-4 py-2 text-sm font-bold text-white shadow-[0_6px_14px_rgba(163,22,27,.3)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-maroon-dark active:scale-95 sm:px-5 sm:py-2.5 sm:text-base"
            >
              Add To Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
