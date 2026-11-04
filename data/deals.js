// Deals shown on the home page ("Hot Deals") and on /deals.
//
// NOTE: these deals and prices are SAMPLES until the owner sends the real list.
// Each deal is built from menu items (`parts`), so the "was" price is the menu total and
// the server prices a deal from `p` like any other item.
//
// Photos: put each deal's picture in public/images/dealmenu/ and set `img`,
// e.g. img: "/images/dealmenu/broast-combo.webp". With an empty `img` the card shows
// the cut-out photos of the items inside the deal instead.

export const DEAL_GROUPS = [
  { id: "today", name: "Today's Deals", short: "Today's", script: "Only till midnight" },
  { id: "weekly", name: "Weekly Deals", short: "Weekly", script: "Every week" },
  { id: "combos", name: "Combos", short: "Combos", script: "Solo & duo" },
  { id: "family", name: "Family Deals", short: "Family", script: "Feed the whole table" },
  { id: "late", name: "Late Night", short: "Late Night", script: "11 PM to 2 AM" },
];

// parts: [menu item id, qty, size?]
export const DEAL_SPECS = [
  { n: "Family Broast Feast", group: "family", p: 2999, featured: true, badge: "Deal of the day", img: "",
    parts: [["broast-full-broast", 1], ["burgers-french-fries-regular", 2], ["drinks-regular-drink", 4]] },
  { n: "Broast Combo", group: "today", p: 699, featured: true, badge: "Today only", img: "",
    parts: [["broast-quarter-broast", 1], ["drinks-regular-drink", 1]] },
  { n: "Pizza Night", group: "today", p: 1299, badge: "Today only", img: "",
    parts: [["pizza-peri-peri", 1, "Regular"], ["drinks-drink-500-ml", 2]] },
  { n: "Fish Feast", group: "today", p: 2399, badge: "Today only", img: "",
    parts: [["fish-fish-n-chips-half", 1], ["drinks-mint-margarita", 1]] },
  { n: "Burger Duo", group: "weekly", when: "Every Monday", p: 1399, featured: true, badge: "Weekly", img: "",
    parts: [["burgers-majestic-double", 2], ["burgers-french-fries-regular", 1]] },
  { n: "Wrap Wednesday", group: "weekly", when: "Every Wednesday", p: 1099, badge: "Weekly", img: "",
    parts: [["burgers-creamy-wrap", 1], ["burgers-chipotle-wrap", 1], ["drinks-regular-drink", 2]] },
  { n: "Pizza Weekend", group: "weekly", when: "Saturday & Sunday", p: 1999, badge: "Weekly", img: "",
    parts: [["pizza-crown-crust", 1, "Large"], ["drinks-drink-500-ml", 2]] },
  { n: "Chixinger Meal", group: "combos", p: 649, badge: "Combo", img: "",
    parts: [["burgers-chixinger-burger", 1], ["burgers-french-fries-regular", 1], ["drinks-regular-drink", 1]] },
  { n: "Doner Duo", group: "combos", p: 799, badge: "Combo", img: "",
    parts: [["burgers-chixdoner-with-cheese", 2], ["drinks-regular-drink", 2]] },
  { n: "Fish & Broast Party", group: "family", p: 5499, badge: "Family", img: "",
    parts: [["fish-fish-n-chips-full", 1], ["broast-half-broast", 1]] },
  { n: "Midnight Chai Box", group: "late", when: "11 PM to 2 AM", p: 499, featured: true, badge: "Late night", img: "",
    parts: [["chai-karak-chai", 2], ["desserts-chocolate-cookies", 2]] },
  { n: "Brownie & Chai", group: "late", when: "11 PM to 2 AM", p: 429, badge: "Late night", img: "",
    parts: [["chai-chaialogy-special", 1], ["desserts-fudge-brownie", 1]] },
];
