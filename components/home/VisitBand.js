import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { IMAGES } from "@/data/images";
import { SITE, mapEmbedUrl, mapLinkUrl } from "@/data/site";

export default function VisitBand() {
  return (
    <section aria-labelledby="visit-title" className="mt-20 grid overflow-hidden rounded-[28px] bg-yellow md:grid-cols-2">
      <div className="flex flex-col justify-start gap-3.5 p-7 text-maroon-dark md:p-11">
        <span className="eyebrow text-[26px] text-maroon">Dine in under the lights</span>
        <h2 id="visit-title" className="heading text-[clamp(32px,3.6vw,48px)]">Visit {SITE.name}</h2>
        <p className="max-w-[44ch]">Fairy-lit garden seating, fresh broast out of the fryer and a pot of chai on the table.</p>
        <div className="mt-1.5 flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3.5">
          <Icon name="pin" className="mt-0.5 size-[22px] flex-none text-maroon" />
          <div>
            <b className="block text-sm">{SITE.branch.name}</b>
            <span className="text-[13.5px]">{SITE.branch.address}</span>
          </div>
          <a href={mapLinkUrl(SITE.branch.mapQuery)} target="_blank" rel="noopener noreferrer" className="ml-auto flex-none self-center rounded-lg bg-maroon px-3 py-2 text-xs font-bold text-white transition hover:bg-maroon-dark">
            Directions
          </a>
        </div>
        {/* Google Maps embed: free, no API key, loads only when scrolled near */}
        <div className="relative mt-1.5 min-h-[240px] flex-1 overflow-hidden rounded-2xl bg-white/55 shadow-[0_0_0_4px_rgba(255,255,255,.55)]">
          <iframe
            title={`Map to ${SITE.name}, ${SITE.branch.name}`}
            src={mapEmbedUrl(SITE.branch.mapQuery)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
      <div className="relative min-h-[280px] md:aspect-[1200/1180]">
        {IMAGES.storefront ? (
          <Image src={IMAGES.storefront} alt="Chixee Broast storefront at night with the lit sign and fairy-light archway" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div role="img" aria-label="Chixee storefront photo coming soon" className="absolute inset-0 grid place-items-center bg-maroon">
            <Icon name="store" className="size-28 text-yellow/70" strokeWidth={1.4} />
          </div>
        )}
      </div>
    </section>
  );
}
