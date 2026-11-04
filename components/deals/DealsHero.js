"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ItemThumb from "@/components/menu/ItemThumb";
import Icon from "@/components/ui/Icon";
import { useItemModal } from "@/context/ItemModalContext";
import { formatPKR } from "@/data/menu";

// Time left until midnight, shown on "today" deals. Rendered only after mount so server and browser HTML match.
function UntilMidnight() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, Math.floor((end - now) / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return null;
  const parts = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((n) => String(n).padStart(2, "0"));
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold sm:text-[13px]">
      Ends in
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && ":"}
          <b className="rounded-md bg-white/20 px-1.5 py-0.5 tabular-nums">{p}</b>
        </span>
      ))}
    </span>
  );
}

// Big deals carousel at the top of /deals. A deal photo (public/images/dealmenu) fills the slide;
// until then the deal's item photos sit on the right. The see-through gradient keeps the text readable.
export default function DealsHero({ slides }) {
  const { openItem } = useItemModal();
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const go = useCallback((i) => setCur((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setCur((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, cur, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured deals"
      className="group/deals relative h-[290px] overflow-hidden rounded-[24px] bg-yellow text-white sm:h-[310px] lg:h-[352px] lg:rounded-[28px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {slides.map((d, i) => {
        const active = i === cur;
        return (
          <article key={d.id} aria-hidden={!active} className={`absolute inset-0 transition-[opacity,visibility] duration-700 ease-brand ${active ? "visible opacity-100" : "invisible opacity-0"}`}>
            {d.img ? (
              <Image src={d.img} alt={d.n} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 800px" className={`object-cover transition-transform duration-[7000ms] ease-linear ${active ? "scale-100" : "scale-110"}`} />
            ) : (
              <div className="absolute inset-y-0 right-0 w-[52%] sm:w-[50%]">
                <span aria-hidden="true" className="absolute -right-[18%] top-1/2 aspect-square w-[115%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff6d6_0%,#ffd75a_70%)]" />
                <div className={`absolute inset-[8%_2%_10%_0] transition-transform duration-[7000ms] ease-linear ${active ? "scale-100" : "scale-110"}`}>
                  <ItemThumb item={d} sizes="(max-width: 1024px) 50vw, 420px" />
                </div>
              </div>
            )}
            {/* See-through brand gradient: strong behind the text, clear over the food */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(107,13,17,.9)_0%,rgba(140,18,24,.72)_38%,rgba(163,22,27,.18)_62%,rgba(163,22,27,0)_78%)]" />
            <div className="relative z-[2] flex h-full max-w-[64%] flex-col justify-center gap-1.5 p-5 pb-8 [&>*]:shrink-0 [text-shadow:0_2px_12px_rgba(60,6,9,.45)] sm:max-w-[56%] sm:gap-2 sm:p-8 lg:p-10">
              {d.badge && <span className="self-start rounded-full bg-yellow px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.8px] text-maroon-dark [text-shadow:none] sm:text-[11px]">{d.badge}</span>}
              <h2 className="font-display text-[clamp(26px,4.4vw,48px)] leading-[1] text-balance">{d.n}</h2>
              <p className="line-clamp-2 max-w-[38ch] text-[12px] text-white/90 sm:text-[15px]">{d.d}</p>
              <p className="flex items-baseline gap-2 whitespace-nowrap">
                <b className="text-[22px] tabular-nums sm:text-[30px]">{formatPKR(d.p)}</b>
                {d.was && <s className="text-xs text-white/75 sm:text-[15px]">{formatPKR(d.was)}</s>}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button type="button" tabIndex={active ? 0 : -1} onClick={() => openItem(d.id)} className="btn-yellow px-4 py-2 text-sm [text-shadow:none] sm:px-6 sm:py-3 sm:text-base">Order deal</button>
                {(d.group === "today" || d.badge === "Deal of the day") && <UntilMidnight />}
              </div>
            </div>
          </article>
        );
      })}

      {slides.length > 1 && (
        <>
          {[["prev", "left", -1, "left-3"], ["next", "right", 1, "right-3"]].map(([k, icon, d, pos]) => (
            <button key={k} type="button" aria-label={`${k === "prev" ? "Previous" : "Next"} deal`} onClick={() => go(cur + d)}
              className={`absolute top-1/2 z-[4] hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-maroon opacity-0 shadow backdrop-blur transition hover:bg-yellow focus-visible:opacity-100 group-hover/deals:opacity-100 md:grid ${pos}`}>
              <Icon name={icon} className="size-5" strokeWidth={2.4} />
            </button>
          ))}
          <div className="absolute inset-x-0 bottom-3 z-[4] flex justify-center gap-1.5 sm:bottom-4">
            {slides.map((d, i) => (
              <button key={d.id} type="button" aria-label={`Deal ${i + 1}`} aria-current={i === cur} onClick={() => go(i)}
                className={`h-2 rounded-full shadow transition-all duration-300 ${i === cur ? "w-6 bg-white" : "w-2 bg-white/55"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
