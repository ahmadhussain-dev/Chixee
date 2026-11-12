import DealsStrip from "@/components/deals/DealsStrip";
import HeroCarousel from "@/components/home/HeroCarousel";
import Ticker from "@/components/home/Ticker";
import MenuBrowser from "@/components/menu/MenuBrowser";
import VisitBand from "@/components/home/VisitBand";
import JsonLd from "@/components/seo/JsonLd";
import { menuSchema, restaurantSchema } from "@/lib/schema";
import { getCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const catalog = await getCatalog();
  return (
    <>
      <JsonLd data={restaurantSchema()} />
      <JsonLd data={menuSchema(catalog)} />
      <HeroCarousel />
      <Ticker />
      <main className="pb-28">
        <DealsStrip />
        <MenuBrowser />
        <div className="wrap">
          <VisitBand />
        </div>
      </main>
    </>
  );
}
