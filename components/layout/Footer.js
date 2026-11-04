import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import SocialIcon, { SOCIAL_STYLE } from "@/components/ui/SocialIcon";
import { SITE, formatTime } from "@/data/site";

const SOCIALS = [
  ["facebook", SITE.facebook, "Facebook"],
  ["instagram", SITE.instagram, "Instagram"],
  ["tiktok", SITE.tiktok, "TikTok"],
  ["whatsapp", SITE.whatsapp, "WhatsApp"],
];

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-night text-on-night">
      <div className="wrap pb-6 pt-9 sm:pb-7 sm:pt-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-10 lg:grid-cols-[1.3fr_1fr_1.1fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Logo size={64} variant="red" />
              <div>
                <b className="block font-display text-[26px] font-normal leading-none text-yellow sm:text-3xl">{SITE.name}</b>
                <small className="font-script text-[19px] text-on-night-muted sm:text-[22px]">{SITE.tagline}</small>
              </div>
            </div>
            <p className="my-4 hidden max-w-[46ch] text-on-night-muted lg:block">
              Authentic injected broast, river fish, loaded pizzas and proper chai, made fresh in Faisalabad for dine-in, pickup and delivery.
            </p>
            <address className="mt-3 flex items-start gap-2.5 text-[13px] not-italic sm:text-sm lg:mt-0">
              <Icon name="pin" className="mt-0.5 size-5 flex-none text-yellow" />
              {SITE.branch.address}
            </address>
          </div>

          {/* Contact (UAN + WhatsApp number, no icons) and social links */}
          <div className="col-span-2 grid grid-cols-2 gap-4 sm:gap-10 lg:col-span-1 lg:block">
            <div>
              <h2 className="mb-2 font-display text-lg font-normal sm:mb-3 sm:text-2xl">Contact Us</h2>
              <small className="block text-xs text-on-night-muted">UAN</small>
              <a href={`tel:${SITE.uan.replace(/\D/g, "")}`} className="text-lg font-bold tabular-nums text-yellow transition hover:text-white sm:text-xl">{SITE.uan}</a>
              <small className="mt-2 block text-xs text-on-night-muted">Call / WhatsApp</small>
              <a href={`tel:${SITE.phoneIntl}`} className="whitespace-nowrap text-lg font-bold tabular-nums text-yellow transition hover:text-white sm:text-xl">{SITE.phone}</a>
            </div>
            <div>
              <h2 className="mb-2.5 font-display text-lg font-normal sm:mb-3 sm:text-2xl lg:mt-7">Follow Us</h2>
              <div className="flex gap-2.5 sm:gap-3" aria-label="Social media">
                {SOCIALS.map(([k, href, label]) => (
                  <a key={k} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Chixee on ${label}`} className={`grid size-10 place-items-center rounded-full transition duration-300 hover:-translate-y-1 hover:scale-105 sm:size-11 ${SOCIAL_STYLE[k]}`}>
                    <SocialIcon name={k} className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h2 className="mb-3 font-display text-lg font-normal sm:mb-4 sm:text-2xl">Our Timings</h2>
            <dl className="grid gap-1.5 text-[13.5px] sm:gap-2.5 sm:text-[15px]">
              {SITE.hours.map((h) => (
                <div key={h.label} className="flex items-baseline justify-between gap-3 lg:border-b lg:border-white/10 lg:pb-2.5 lg:last:border-0">
                  <dt>{h.label}</dt>
                  <dd className="font-semibold tabular-nums text-yellow">{formatTime(h.opens)} - {formatTime(h.closes)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 text-[12.5px] text-on-night-muted sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4 sm:pt-5 sm:text-[13.5px]">
          <span>© {new Date().getFullYear()} {SITE.name} · A project of {SITE.company} · Faisalabad, Pakistan</span>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            <Link href="/about" className="transition hover:text-yellow">About</Link>
            <Link href="/contact" className="transition hover:text-yellow">Contact</Link>
            <Link href="/track" className="transition hover:text-yellow">Track order</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
