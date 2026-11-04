import DealsBrowser from "@/components/deals/DealsBrowser";
import JsonLd from "@/components/seo/JsonLd";
import { DEALS } from "@/data/menu";
import { SITE } from "@/data/site";

export const metadata = {
  title: "Deals",
  description: `Today's, weekly, combo, family and late night deals at ${SITE.name}, Kohinoor City, Faisalabad. Order online for delivery or pickup.`,
  alternates: { canonical: "/deals" },
};

const offers = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: `${SITE.name} deals`,
  itemListElement: DEALS.map((d) => ({
    "@type": "Offer",
    name: d.n,
    description: d.d,
    price: d.p,
    priceCurrency: "PKR",
  })),
};

export default function DealsPage() {
  return (
    <main className="pb-28">
      <JsonLd data={offers} />
      <DealsBrowser />
    </main>
  );
}
