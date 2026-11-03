import Link from "next/link";
import VisitBand from "@/components/home/VisitBand";
import { SITE } from "@/data/site";

export const metadata = {
  title: "About us",
  description: `${SITE.name} serves authentic injected broast, Indus River Saul fish n chips, pizzas and Chaialogy chai at Kohinoor City, Faisalabad.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="wrap pb-28 pt-14">
      <span className="eyebrow text-3xl text-maroon">Our story</span>
      <h1 className="heading mt-2 text-[clamp(40px,5vw,64px)]">{SITE.tagline}</h1>
      <div className="mt-6 grid max-w-3xl gap-4 text-lg text-muted">
        <p>{SITE.name} is a {SITE.company} project in Faisalabad. Our broast is injected with marinade, pressure fried and served hot with fries, buns and our own garlic dips.</p>
        <p>Alongside the broast you&apos;ll find Indus River Saul fish n chips, loaded pizzas with our Middle Eastern herb, burgers and wraps, and a full Chaialogy chai menu, because chai isn&apos;t just a drink, it&apos;s science.</p>
      </div>
      <Link href="/#menu" className="btn-yellow mt-8">See the menu</Link>
      <VisitBand />
    </main>
  );
}
