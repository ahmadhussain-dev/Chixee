"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { Glyph } from "@/components/ui/Icon";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";

const SLIDES = [
  {
    eyebrow: "Authentic broast, injected",
    title: <>Chemistry in <em className="not-italic text-yellow">every bite</em></>,
    text: "Pressure-fried broast, marinated to the bone and served hot with fries, buns and our garlic dips.",
    ctas: [{ href: "#broast", label: "Order Broast", primary: true }, { href: "#menu", label: "See full menu" }],
    img: IMAGES.heroBroast,
    pos: "center 30%",
    alt: "Diner holding up a crispy piece of Chixee broast over a tray of broast, fries, buns and dips",
    glyph: "drum",
  },
  {
    eyebrow: "Fish n Chips",
    title: <>Indus River <em className="not-italic text-yellow">Saul fish</em></>,
    text: "A delicate freshwater fish with a mild, buttery flavour, crumbed and fried golden with fries, bun and dips.",
    ctas: [{ href: "#fish", label: "Order fish", primary: true }],
    img: IMAGES.heroFish,
    pos: "center 40%",
    alt: "Diner biting into flaky fried Saul fish with fries, bun and dips on the table",
    glyph: "drum",
  },
];

export default function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const go = useCallback((i) => setCur((i + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused, cur]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="group/hero relative overflow-hidden bg-night text-white"
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
      <div className="relative h-[clamp(440px,46vw,560px)]">
        {SLIDES.map((s, i) => {
          const active = i === cur;
          const Title = i === 0 ? "h1" : "h2";
          return (
            <article
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 grid md:grid-cols-[1.05fr_1fr] transition-[opacity,visibility] duration-[900ms] ease-brand ${active ? "visible opacity-100" : "invisible opacity-0"}`}
            >
              <div className="relative z-[2] flex flex-col justify-end gap-4 px-5 pb-16 pt-6 md:justify-center md:py-10 md:pl-[max(24px,calc((100vw-1240px)/2+16px))] md:pr-6">
                {[
                  <span key="e" className="eyebrow text-[clamp(24px,2.6vw,34px)] text-yellow">{s.eyebrow}</span>,
                  <Title key="t" className="heading m-0 text-[clamp(44px,6.6vw,96px)] uppercase leading-[.92] tracking-[.5px] text-balance">{s.title}</Title>,
                  <p key="p" className="m-0 max-w-[42ch] text-[clamp(14px,1.2vw,17px)] text-[#eadbd0]">{s.text}</p>,
                  <div key="c" className="mt-1.5 flex flex-wrap gap-3">
                    {s.ctas.map((c) => (
                      <Link key={c.label} href={c.href} tabIndex={active ? 0 : -1} className={c.primary ? "btn-yellow" : "btn text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,.5)] hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_2px_#fff]"}>
                        {c.label}
                      </Link>
                    ))}
                  </div>,
                ].map((el, k) => (
                  <div key={k} style={{ transitionDelay: active ? `${k * 80}ms` : "0ms" }} className={`transition-all duration-700 ease-brand ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                    {el}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 overflow-hidden">
                {s.img ? (
                  <Image src={s.img} alt={s.alt} fill priority={i === 0} sizes="100vw" style={{ objectPosition: s.pos }} className={`object-cover transition-transform duration-[7000ms] ease-linear ${active ? "scale-100" : "scale-[1.12]"}`} />
                ) : (
                  // Placeholder until a banner image is set in data/images.js
                  <div className="tile-bg absolute inset-0 grid place-items-center overflow-hidden" aria-label={s.alt} role="img">
                    <Glyph name={s.glyph} className="relative size-40 text-maroon/70" />
                  </div>
                )}
                <div className="absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(28,17,13,.92)_0%,rgba(28,17,13,.6)_45%,rgba(28,17,13,.2)_100%)] md:bg-[linear-gradient(90deg,rgba(28,17,13,.82)_0%,rgba(28,17,13,.55)_38%,rgba(28,17,13,.1)_62%,rgba(28,17,13,0)_100%)]" />
              </div>
            </article>
          );
        })}
      </div>

      <div aria-hidden="true" className="absolute bottom-14 right-[max(24px,calc((100vw-1240px)/2+16px))] z-[3] hidden size-[120px] animate-spin-slow place-items-center rounded-full bg-yellow text-center font-display text-base leading-[1.05] text-maroon-dark shadow-[0_10px_30px_rgba(0,0,0,.35)] md:grid">
        <div><span className="block text-[30px]">UAN</span>{SITE.uan}</div>
      </div>

      {[["prev", "left", -1, "left-3"], ["next", "right", 1, "right-3"]].map(([k, icon, d, pos]) => (
        <button key={k} type="button" aria-label={`${k === "prev" ? "Previous" : "Next"} slide`} onClick={() => go(cur + d)}
          className={`absolute top-1/2 z-[4] hidden size-[46px] -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition hover:bg-yellow hover:text-maroon-dark focus-visible:opacity-100 group-hover/hero:opacity-100 md:grid ${pos}`}>
          <Icon name={icon} className="size-[22px]" strokeWidth={2.4} />
        </button>
      ))}

      <div className="absolute inset-x-0 bottom-5 z-[4] flex items-center justify-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} aria-current={i === cur} onClick={() => go(i)}
            className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-500 ease-brand ${i === cur ? "w-[42px] bg-white/35" : "w-2.5 bg-white/45"}`}>
            {i === cur && <span key={`${cur}-${paused}`} className={`absolute inset-0 origin-left bg-yellow ${paused ? "" : "animate-fill"}`} />}
          </button>
        ))}
      </div>
    </section>
  );
}
