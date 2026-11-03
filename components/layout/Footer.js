import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { SITE } from "@/data/site";

function Row({ icon, small, children, href }) {
  const body = (
    <>
      <span className="grid size-[46px] flex-none place-items-center rounded-xl bg-night-2 text-yellow transition duration-300 group-hover:-rotate-[8deg] group-hover:bg-yellow group-hover:text-maroon-dark">
        <Icon name={icon} className="size-[22px]" />
      </span>
      <div>
        <small className="block text-[12.5px] text-on-night-muted">{small}</small>
        <b className="font-semibold tabular-nums">{children}</b>
      </div>
    </>
  );
  return (
    <li className="group">
      {href ? <a href={href} className="flex items-center gap-3.5">{body}</a> : <div className="flex items-center gap-3.5">{body}</div>}
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="bg-night text-on-night">
      <div className="wrap pb-7 pt-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo size={84} />
              <div>
                <b className="block font-display text-3xl font-normal leading-none text-yellow">{SITE.name}</b>
                <small className="font-script text-[22px] text-on-night-muted">{SITE.tagline}</small>
              </div>
            </div>
            <p className="my-4 max-w-[46ch] text-on-night-muted">
              Authentic injected broast, river fish, loaded pizzas and proper chai, made fresh in Faisalabad for dine-in, pickup and delivery.
            </p>
            <address className="flex items-start gap-2.5 text-sm not-italic">
              <Icon name="pin" className="mt-0.5 size-5 flex-none text-yellow" />
              {SITE.branch.address}
            </address>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-normal">Contact Us</h2>
            <ul className="grid gap-3.5">
              <Row icon="phone" small="UAN" href="tel:111341111">{SITE.uan}</Row>
              <Row icon="phone" small="Call / WhatsApp" href={`https://wa.me/${SITE.phoneIntl.replace("+", "")}`}>{SITE.phone}</Row>
              <Row icon="fb" small="Facebook" href={SITE.facebook}>Chixee</Row>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-normal">Services</h2>
            <ul className="grid gap-3.5">
              <Row icon="box" small="Track Order" href="/track">Order Status</Row>
              <Row icon="bike" small="Order Type">Delivery &amp; Pickup</Row>
              <Row icon="wallet" small="Payment">Cash on Delivery / Bank Transfer</Row>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-5 text-[13.5px] text-on-night-muted">
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
