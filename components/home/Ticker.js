import { SITE } from "@/data/site";

const WORDS = ["Authentic injected broast", SITE.tagline, `UAN ${SITE.uan}`, "Fish n Chips", "Loaded pizzas", "Chaialogy", "Delivery & Pickup in Faisalabad"];

export default function Ticker() {
  return (
    <div aria-hidden="true" className="overflow-hidden whitespace-nowrap border-y-[3px] border-yellow bg-maroon text-yellow">
      <div className="inline-flex animate-marquee gap-9 py-2.5 font-display text-lg uppercase tracking-[1px]">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="after:ml-9 after:text-white after:content-['✦']">{w}</span>
        ))}
      </div>
    </div>
  );
}
