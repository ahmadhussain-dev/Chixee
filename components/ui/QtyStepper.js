"use client";

export default function QtyStepper({ qty, onChange, small = false }) {
  const btn = small ? "h-[34px] w-8 text-[17px]" : "h-[42px] w-10 text-xl";
  return (
    <span className="inline-flex animate-pop items-center overflow-hidden rounded-[11px] bg-maroon text-white">
      <button type="button" aria-label="Remove one" onClick={() => onChange(qty - 1)} className={`${btn} font-semibold transition hover:bg-maroon-dark`}>−</button>
      <output className="min-w-[30px] text-center font-bold tabular-nums">{qty}</output>
      <button type="button" aria-label="Add one" onClick={() => onChange(qty + 1)} className={`${btn} font-semibold transition hover:bg-maroon-dark`}>+</button>
    </span>
  );
}
