export const SITE = {
  name: "Chixee Broast",
  shortName: "Chixee",
  tagline: "Chemistry in every bite",
  description:
    "Authentic injected broast, Indus River Saul fish n chips, loaded pizzas, wraps and Chaialogy chai in Faisalabad. Order online for delivery or pickup.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  uan: "111-341-111",
  phone: "0304-447 1111",
  phoneIntl: "+923044471111",
  facebook: "https://www.facebook.com/chixeefastfood",
  instagram: "https://www.instagram.com/chixee_broast",
  tiktok: "https://www.tiktok.com/@chixee_pk",
  whatsapp: "https://wa.me/923044471111",
  company: "Ahad Baig Food & Beverages",
  city: "Faisalabad",
  branch: {
    name: "Kohinoor City",
    address: "9B, Adjacent Legacy Tower, Kohinoor City, Faisalabad",
    street: "9B, Adjacent Legacy Tower, Kohinoor City",
    // Free Google Maps embed (no API key). Swap the query for the exact pin/place name if needed.
    mapQuery: "Chixee Broast, Kohinoor City, Faisalabad",
  },
  // Opening hours (confirmed by Ahmad 2026-11-03). Closing after midnight belongs to the same day's shift.
  hours: [
    { label: "Monday - Thursday", days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "13:00", closes: "02:00" },
    { label: "Friday", days: ["Friday"], opens: "14:00", closes: "02:00" },
    { label: "Saturday - Sunday", days: ["Saturday", "Sunday"], opens: "13:00", closes: "02:00" },
  ],
};

export const CITIES = ["Faisalabad"];

// "14:00" -> "02:00 PM"
export const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

export const mapEmbedUrl = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
export const mapLinkUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
