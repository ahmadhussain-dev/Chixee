import { Caveat, Lilita_One, Poppins } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/providers/Providers";
import { SITE } from "@/data/site";
import { IMAGES } from "@/data/images";
import "./globals.css";

const lilita = Lilita_One({ weight: "400", subsets: ["latin"], variable: "--font-lilita", display: "swap" });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins", display: "swap" });
const caveat = Caveat({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-caveat", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Broast, Fish n Chips & Pizza in Faisalabad`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["Chixee", "broast Faisalabad", "fish n chips Faisalabad", "Saul fish", "pizza Faisalabad", "Kohinoor City food", "food delivery Faisalabad", "Chaialogy"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: "/",
    ...(IMAGES.ogImage ? { images: [{ url: IMAGES.ogImage, width: 1200, height: 630 }] } : {}),
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport = { themeColor: "#FFC20E", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lilita.variable} ${poppins.variable} ${caveat.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning: browser extensions (Grammarly, translators, dark mode…) add attributes to <html>/<body> before React loads */}
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        {/* Vercel Speed Insights: real-visitor page speed, shown in the Vercel dashboard (no-op locally) */}
        <SpeedInsights />
      </body>
    </html>
  );
}
