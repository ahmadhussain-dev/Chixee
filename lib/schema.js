import { SITE } from "@/data/site";
import { MENU, ITEMS, priceOf } from "@/data/menu";

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE.url}/#restaurant`,
    name: SITE.name,
    slogan: SITE.tagline,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phoneIntl,
    servesCuisine: ["Fried chicken", "Fish and chips", "Pizza", "Burgers", "Tea"],
    priceRange: "Rs. 70 - Rs. 4,800",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank transfer",
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.branch.street,
      addressLocality: "Faisalabad",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    openingHoursSpecification: SITE.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [SITE.facebook, SITE.instagram, SITE.tiktok],
    hasMenu: `${SITE.url}/#menu`,
  };
}

export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE.name} Menu`,
    url: `${SITE.url}/#menu`,
    hasMenuSection: MENU.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: ITEMS.filter((i) => i.category === c.id).map((i) => ({
        "@type": "MenuItem",
        name: i.n,
        description: i.d,
        offers: { "@type": "Offer", price: priceOf(i), priceCurrency: "PKR" },
      })),
    })),
  };
}
