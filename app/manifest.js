import { SITE } from "@/data/site";

export default function manifest() {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#FFC20E",
  };
}
