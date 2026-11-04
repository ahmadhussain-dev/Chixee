// Deals shown on the home page ("Hot Deals") and on /deals.
//
// NOTE: these deals and prices are SAMPLES until the owner sends the real list.
// Each deal is built from menu items (`parts`), so the "was" price is the menu total and
// the server prices a deal from `p` like any other item.
//
// Photos: put each deal's picture in public/images/dealmenu/ and set `img`,
// e.g. img: "/images/dealmenu/broast-combo.webp". With an empty `img` the card shows
// the cut-out photos of the items inside the deal instead.

// icon: Lucide icon name for the Deal Categories tiles.
// banner: the strip under each group heading. Set `img` to a photo in public/images/dealmenu/ to replace
// the built-in strip (text + item cut-outs); leave banner null for no strip.
export const DEAL_GROUPS = [
  { id: "today", name: "Today's Deals", short: "Today's", script: "Only till midnight", icon: "Flame",
    banner: { t1: "Today", t2: "Only", sub: "Fresh every day, gone at midnight", art: ["broast-quarter-broast", "drinks-regular-drink"], tone: "yellow", img: "" } },
  { id: "weekly", name: "Weekly Deals", short: "Weekly", script: "Every week", icon: "CalendarDays",
    banner: { t1: "Weekly", t2: "Deals", sub: "Burger Monday · Wrap Wednesday · Pizza Weekend", art: ["burgers-majestic-double", "burgers-creamy-wrap"], tone: "maroon", img: "" } },
  { id: "combos", name: "Combos", short: "Combos", script: "Solo & duo", icon: "Hamburger", banner: null },
  { id: "family", name: "Family Deals", short: "Family", script: "Feed the whole table", icon: "Users",
    banner: { t1: "Family", t2: "Feast", sub: "Big trays for big tables", art: ["broast-full-broast", "fish-fish-n-chips-full"], tone: "maroon", img: "" } },
  { id: "late", name: "Late Night", short: "Late Night", script: "11 PM to 2 AM", icon: "Moon", banner: null },
];

// serves: how many people the deal feeds (badge on the card). parts: [menu item id, qty, size?]
export const DEAL_SPECS = [
  { n: "Family Broast Feast", serves: 4, group: "family", p: 2999, featured: true, badge: "Deal of the day", img: "",
    parts: [["broast-full-broast", 1], ["burgers-french-fries-regular", 2], ["drinks-regular-drink", 4]] },
  { n: "Broast Combo", serves: 1, group: "today", p: 699, featured: true, badge: "Today only", img: "",
    parts: [["broast-quarter-broast", 1], ["drinks-regular-drink", 1]] },
  { n: "Pizza Night", serves: 2, group: "today", p: 1299, badge: "Today only", img: "",
    parts: [["pizza-peri-peri", 1, "Regular"], ["drinks-drink-500-ml", 2]] },
  { n: "Fish Feast", serves: 2, group: "today", p: 2399, badge: "Today only", img: "",
    parts: [["fish-fish-n-chips-half", 1], ["drinks-mint-margarita", 1]] },
  { n: "Burger Duo", serves: 2, group: "weekly", when: "Every Monday", p: 1399, featured: true, badge: "Weekly", img: "",
    parts: [["burgers-majestic-double", 2], ["burgers-french-fries-regular", 1]] },
  { n: "Wrap Wednesday", serves: 2, group: "weekly", when: "Every Wednesday", p: 1099, badge: "Weekly", img: "",
    parts: [["burgers-creamy-wrap", 1], ["burgers-chipotle-wrap", 1], ["drinks-regular-drink", 2]] },
  { n: "Pizza Weekend", serves: 3, group: "weekly", when: "Saturday & Sunday", p: 1999, badge: "Weekly", img: "",
    parts: [["pizza-crown-crust", 1, "Large"], ["drinks-drink-500-ml", 2]] },
  { n: "Chixinger Meal", serves: 1, group: "combos", p: 649, badge: "Combo", img: "",
    parts: [["burgers-chixinger-burger", 1], ["burgers-french-fries-regular", 1], ["drinks-regular-drink", 1]] },
  { n: "Doner Duo", serves: 2, group: "combos", p: 799, badge: "Combo", img: "",
    parts: [["burgers-chixdoner-with-cheese", 2], ["drinks-regular-drink", 2]] },
  { n: "Fish & Broast Party", serves: 6, group: "family", p: 5499, badge: "Family", img: "",
    parts: [["fish-fish-n-chips-full", 1], ["broast-half-broast", 1]] },
  { n: "Midnight Chai Box", serves: 2, group: "late", when: "11 PM to 2 AM", p: 499, featured: true, badge: "Late night", img: "",
    parts: [["chai-karak-chai", 2], ["desserts-chocolate-cookies", 2]] },
  { n: "Brownie & Chai", serves: 1, group: "late", when: "11 PM to 2 AM", p: 429, badge: "Late night", img: "",
    parts: [["chai-chaialogy-special", 1], ["desserts-fudge-brownie", 1]] },
];
