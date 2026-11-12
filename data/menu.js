// Starting menu. Since the admin panel can add, edit, hide and delete items (stored in MongoDB),
// this file is only used to fill the database the first time, and as a fallback if the database is down.
// Category headings (name, icon, note) still live here. Helpers and the catalog builder: lib/menu.js.
// Photos: background-removed cut-outs in public/images/menu-cut/.

const SOFT_DRINKS = ["Coca-Cola", "Sprite", "Fanta"];

const MENU = [
  { id: "broast", name: "Broast", script: "Authentic", glyph: "drum", note: "Leg, thigh, wing and chest pieces, injected and pressure fried.", items: [
    { n: "Quarter Broast", d: "2 Pc chicken (leg & thigh), French fries, bun, 1 reg garlic", p: 750, img: "/images/menu-cut/quarter-broast.webp" , loading:"eager" },
    { n: "Half Broast", d: "4 Pc chicken (leg, thigh, wing, chest), French fries, 2 buns, 1 reg garlic, 1 spicy garlic", p: 1450, tag: "Popular", img: "/images/menu-cut/half-broast.webp", popular: true },
    { n: "Full Broast", d: "8 Pc chicken (2 of each piece), French fries, 4 buns, 2 reg garlic, 2 spicy garlic", p: 2750, tag: "Family", img: "/images/menu-cut/full-broast.webp", popular: true },
  ]},
  { id: "fish", name: "Fish n Chips", script: "River Saul", glyph: "fish", note: "A delicate freshwater Indus River fish with a mild, buttery flavour.", items: [
    { n: "Fish n Chips (Half)", d: "River Saul fish with fries, bun and dip sauces", p: 2500, img: "/images/menu-cut/fish-n-chips-half.webp", popular: true },
    { n: "Fish n Chips (Full)", d: "River Saul fish with fries, bun and dip sauces", p: 4800, tag: "Share", img: "/images/menu-cut/fish-n-chips-full.webp" },
  ]},
  // NOTE: Small pizza prices are placeholders until the owner confirms them.
  { id: "pizza", name: "Pizza", script: "Middle Eastern herb", glyph: "pizza", note: "Every pizza comes with our special Middle Eastern herb.", items: [
    { n: "Chixie Special Full Loaded", d: "Special Middle Eastern herb", sizes: { Small: 950, Regular: 1450, Large: 2100 }, img: "/images/menu-cut/special-loaded-pizza.webp", tag: "Signature", popular: true },
    { n: "Crown Crust", d: "Special Middle Eastern herb", sizes: { Small: 800, Regular: 1200, Large: 1800 }, img: "/images/menu-cut/crown-crust.webp" },
    { n: "Peri Peri", d: "Special Middle Eastern herb", sizes: { Small: 800, Regular: 1200, Large: 1800 }, img: "/images/menu-cut/peri-peri-pizza.webp" },
    { n: "Zaatar Special", d: "Thin crust, special Middle Eastern herb", p: 850, img: "/images/menu-cut/zaatar-special.webp" },
  ]},
  { id: "burgers", name: "Burgers & Slices", short: "Burgers", script: "Stacked", glyph: "burger", items: [
    { n: "Majestic Double", meal: true, d: "Double beef patty burger", p: 750, tag: "Beef", img: "/images/menu-cut/majestic-burger.webp", popular: true },
    { n: "Chixinger Burger", meal: true, d: "Crispy fried chicken fillet burger", p: 480, img: "/images/menu-cut/chixinger-burger.webp", popular: true },
    { n: "Creamy Wrap", meal: true, d: "Grilled chicken wrapped with creamy sauce", p: 580, img: "/images/menu-cut/creamy-wrap.webp" },
    { n: "Chipotle Wrap", meal: true, d: "Grilled chicken wrapped with smoky chipotle", p: 580, img: "/images/menu-cut/chipotle-wrap.webp" },
    { n: "Club Sandwich", meal: true, d: "Toasted triple-layer chicken club", p: 450, img: "/images/menu-cut/club-sandwich.webp" },
    { n: "ChixDoner with Cheese", meal: true, d: "Chixee doner with melted cheese", p: 380, img: "/images/menu-cut/chixdoner-with-cheese.webp" },
    { n: "ChixDoner without Cheese", meal: true, d: "Chixee doner, classic", p: 320, img: "/images/menu-cut/chixdoner-without-cheese.webp" },
    { n: "Quesadilla", meal: true, d: "Grilled tortilla with chicken and cheese", p: 550, img: "/images/menu-cut/quesadilla.webp" },
    { n: "Schnitzel", meal: true, d: "Golden crumbed chicken schnitzel", p: 450, img: "/images/menu-cut/schnitzel.webp" },
    { n: "French Fries (Regular)", d: "Crispy salted fries", p: 220, img: "/images/menu-cut/french-fries.webp" },
  ]},
  { id: "chai", name: "Chaialogy", script: "It’s science", glyph: "cup", note: "Chai isn’t just a drink, it’s science.", items: [
    { n: "Chaialogy Special", d: "Our signature house chai", p: 180, tag: "House", img: "/images/menu-cut/chaialogy-special-chai.webp", popular: true },
    { n: "Karak Chai", d: "Strong, slow-brewed karak", p: 150, img: "/images/menu-cut/karak-chai.webp" },
    { n: "Doodh Patti", d: "Milk-brewed, rich and creamy", p: 150 , img: "/images/menu-cut/doodh-patti.webp"},
    { n: "Chocolate Chai", d: "Chai with a chocolate finish", p: 180, img: "/images/menu-cut/chocolate-chai.webp" },
    { n: "Adrak Chai", d: "Ginger-spiced chai", p: 180, img: "/images/menu-cut/adrak-chai.webp" },
  ]},
  { id: "desserts", name: "Cookies & Desserts", short: "Desserts", script: "Sweet finish", glyph: "cake", items: [
    { n: "Fudge Brownie", d: "Dense chocolate fudge brownie", p: 320, img: "/images/menu-cut/fudge-brownie.webp" },
    { n: "Lotus Slice", d: "Lotus biscoff slice", p: 280, img: "/images/menu-cut/lotus-slice.webp" },
    { n: "Caramel Slice", d: "Buttery caramel slice", p: 280, img: "/images/menu-cut/caramel-slice.webp" },
    { n: "Chocolate Cookies", d: "Chewy chocolate cookies", p: 150, img: "/images/menu-cut/chocolate-cookies.webp" },
    { n: "Vanilla Cookies", d: "Classic vanilla cookies", p: 150, img: "/images/menu-cut/vanilla-cookies.webp" },
    { n: "Extra Bun", d: "Soft bun on the side", p: 60, img: "/images/menu-cut/extra-bun.webp" },
  ]},
  { id: "drinks", name: "Beverages & Drinks", short: "Drinks", script: "Chill", glyph: "glass", items: [
    { n: "Mint Margarita", d: "Fresh mint and lemon, blended icy", p: 280, img: "/images/menu-cut/mint-margarita.webp" },
    { n: "Blue Lagoon Mocktail", d: "Blue curaçao mocktail with lemon", p: 260, img: "/images/menu-cut/blue-lagoon-mocktail.webp" },
    { n: "Lemonade", d: "Fresh squeezed lemonade", p: 220, img: "/images/menu-cut/lemonade.webp" },
    { n: "Diet Sprite 500ml", d: "Sugar-free Sprite, 500 ml bottle", p: 280, img: "/images/menu-cut/diet-sprite-500-ml.webp" },
    { n: "Regular Drink", d: "Soft drink, regular", p: 100, flavours: SOFT_DRINKS, img: "/images/menu-cut/regular-drink.webp" },
    { n: "Drink 500 ml", d: "Soft drink, 500 ml bottle", p: 130, flavours: SOFT_DRINKS, img: "/images/menu-cut/drink-500-ml.webp" },
    { n: "Drinking Water", d: "Mineral water", sizes: { "½ Litre": 70, "1.5 Litre": 160 }, img: "/images/menu-cut/drinking-water-1-5-litre.webp" },
  ]},
  { id: "addons", name: "Add-ons", script: "Make it yours", glyph: "plus", items: [
    { n: "Cheese Slice", d: "Add to any burger or doner", p: 70, img: "/images/menu-cut/cheese-slice.webp" },
    { n: "Garlic Sauce", d: "Our regular garlic dip", p: 70, img: "/images/menu-cut/garlic-sauce.webp" },
    { n: "Spicy Garlic", d: "Garlic dip with a kick", p: 70, img: "/images/menu-cut/spicy-garlic.webp" },
  ]},
];


const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Category headings in menu order (items are added from the admin panel).
export const CATEGORIES = MENU.map(({ items, ...c }) => c);

// Items in the stored shape. Keys keep the old "<category>-<name>" ids so carts and orders stay valid.
export const SEED_ITEMS = MENU.flatMap((c) =>
  c.items.map((it, i) => ({
    key: `${c.id}-${slug(it.n)}`,
    category: c.id,
    n: it.n,
    d: it.d || "",
    p: it.p ?? null,
    sizes: it.sizes ? Object.entries(it.sizes).map(([name, price]) => ({ name, price })) : [],
    meal: !!it.meal,
    flavours: it.flavours || [],
    tag: it.tag || "",
    popular: !!it.popular,
    img: it.img || "",
    active: true,
    sort: i,
  }))
);

// "Frequently bought together" suggestions per category (item ids, optionally with a fixed variation).
export const FBT = {
  broast: ["drinks-regular-drink", "drinks-drink-500-ml", "addons-garlic-sauce", "addons-spicy-garlic", "desserts-extra-bun", "burgers-french-fries-regular", "desserts-fudge-brownie"],
  fish: ["drinks-regular-drink", "drinks-drink-500-ml", "addons-garlic-sauce", "addons-spicy-garlic", "drinks-lemonade", "desserts-fudge-brownie"],
  pizza: ["drinks-drink-500-ml", "drinks-regular-drink", "addons-garlic-sauce", "addons-spicy-garlic", "burgers-french-fries-regular", "desserts-chocolate-cookies"],
  burgers: ["drinks-regular-drink", "burgers-french-fries-regular", "addons-cheese-slice", "addons-garlic-sauce", "addons-spicy-garlic", "drinks-mint-margarita", "desserts-fudge-brownie"],
  chai: ["desserts-chocolate-cookies", "desserts-vanilla-cookies", "desserts-fudge-brownie", "desserts-lotus-slice", "desserts-caramel-slice"],
  desserts: ["chai-chaialogy-special", "chai-karak-chai", "drinks-lemonade", "drinks-mint-margarita"],
  drinks: ["burgers-french-fries-regular", "desserts-fudge-brownie", "desserts-chocolate-cookies"],
  addons: ["burgers-french-fries-regular", "drinks-regular-drink"],
  deals: ["addons-garlic-sauce", "addons-spicy-garlic", "drinks-mint-margarita", "desserts-fudge-brownie", "desserts-extra-bun"],
};
// What to do if an item is out of stock (chosen in the item popup, shown to the admin).
export const IF_UNAVAILABLE = {
  remove: "Remove it from my order",
  call: "Call me to discuss",
  cancel: "Cancel the entire order",
};
