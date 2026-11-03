// Single source of truth for menu items and prices.
// Photos: originals in public/images/menu/, background-removed cut-outs (shown on the yellow tiles) in public/images/menu-cut/.
// Items with an empty `img` (or none) show a branded yellow tile instead.
// The server recalculates every order total from this file, so prices can't be changed from the browser.

export const MENU = [
  { id: "broast", name: "Broast", script: "Authentic", glyph: "drum", note: "Leg, thigh, wing and chest pieces, injected and pressure fried.", items: [
    { n: "Quarter Broast", d: "2 Pc chicken (leg & thigh), French fries, bun, 1 reg garlic", p: 750, img: "/images/menu-cut/quarter-broast.webp" },
    { n: "Half Broast", d: "4 Pc chicken (leg, thigh, wing, chest), French fries, 2 buns, 1 reg garlic, 1 spicy garlic", p: 1450, tag: "Popular", img: "/images/menu-cut/half-broast.webp", popular: true },
    { n: "Full Broast", d: "8 Pc chicken (2 of each piece), French fries, 4 buns, 2 reg garlic, 2 spicy garlic", p: 2750, tag: "Family", img: "/images/menu-cut/full-broast.webp", popular: true },
  ]},
  { id: "fish", name: "Fish n Chips", script: "River Saul", glyph: "drum", note: "A delicate freshwater Indus River fish with a mild, buttery flavour.", items: [
    { n: "Fish n Chips (Half)", d: "River Saul fish with fries, bun and dip sauces", p: 2500, img: "/images/menu-cut/fish-n-chips-half.webp", popular: true },
    { n: "Fish n Chips (Full)", d: "River Saul fish with fries, bun and dip sauces", p: 4800, tag: "Share", img: "/images/menu-cut/fish-n-chips-full.webp" },
  ]},
  // NOTE: Small pizza prices are placeholders until the owner confirms them.
  { id: "pizza", name: "Pizza", script: "Middle Eastern herb", glyph: "pizza", note: "Every pizza comes with our special Middle Eastern herb.", items: [
    { n: "Chixie Special Full Loaded", d: "Special Middle Eastern herb", sizes: { Small: 950, Regular: 1450, Large: 2100 }, img: "", tag: "Signature", popular: true },
    { n: "Crown Crust", d: "Special Middle Eastern herb", sizes: { Small: 800, Regular: 1200, Large: 1800 }, img: "/images/menu-cut/crown-crust.webp" },
    { n: "Peri Peri", d: "Special Middle Eastern herb", sizes: { Small: 800, Regular: 1200, Large: 1800 }, img: "/images/menu-cut/peri-peri-pizza.webp" },
    { n: "Zaatar Special", d: "Thin crust, special Middle Eastern herb", p: 850, img: "" },
  ]},
  { id: "burgers", name: "Burgers & Slices", script: "Stacked", glyph: "burger", items: [
    { n: "Majestic Double", d: "Double beef patty burger", p: 750, tag: "Beef", img: "/images/menu-cut/majestic-burger.webp", popular: true },
    { n: "Chixinger Burger", d: "Crispy fried chicken fillet burger", p: 480, img: "/images/menu-cut/chixinger-burger.webp", popular: true },
    { n: "Creamy Wrap", d: "Grilled chicken wrapped with creamy sauce", p: 580, img: "/images/menu-cut/creamy-wrap.webp" },
    { n: "Chipotle Wrap", d: "Grilled chicken wrapped with smoky chipotle", p: 580, img: "/images/menu-cut/chipotle-wrap.webp" },
    { n: "Club Sandwich", d: "Toasted triple-layer chicken club", p: 450, img: "/images/menu-cut/club-sandwich.webp" },
    { n: "ChixDoner with Cheese", d: "Chixee doner with melted cheese", p: 380, img: "/images/menu-cut/chixdoner-with-cheese.webp" },
    { n: "ChixDoner without Cheese", d: "Chixee doner, classic", p: 320 },
    { n: "Quesadilla", d: "Grilled tortilla with chicken and cheese", p: 550, img: "/images/menu-cut/quesadilla.webp" },
    { n: "Schnitzel", d: "Golden crumbed chicken schnitzel", p: 450, img: "" },
    { n: "French Fries (Regular)", d: "Crispy salted fries", p: 220, glyph: "fries" },
  ]},
  { id: "chai", name: "Chaialogy", script: "It’s science", glyph: "cup", note: "Chai isn’t just a drink, it’s science.", items: [
    { n: "Chaialogy Special", d: "Our signature house chai", p: 180, tag: "House", img: "/images/menu-cut/chaialogy-special-chai.webp", popular: true },
    { n: "Karak Chai", d: "Strong, slow-brewed karak", p: 150, img: "/images/menu-cut/karak-chai.webp" },
    { n: "Doodh Patti", d: "Milk-brewed, rich and creamy", p: 150 },
    { n: "Chocolate Chai", d: "Chai with a chocolate finish", p: 180, img: "/images/menu-cut/chocolate-chai.webp" },
    { n: "Adrak Chai", d: "Ginger-spiced chai", p: 180, img: "/images/menu-cut/adrak-chai.webp" },
  ]},
  { id: "desserts", name: "Cookies & Desserts", script: "Sweet finish", glyph: "cake", items: [
    { n: "Fudge Brownie", d: "Dense chocolate fudge brownie", p: 320, img: "/images/menu-cut/fudge-brownie.webp" },
    { n: "Lotus Slice", d: "Lotus biscoff slice", p: 280, img: "/images/menu-cut/lotus-slice.webp" },
    { n: "Caramel Slice", d: "Buttery caramel slice", p: 280, img: "/images/menu-cut/caramel-slice.webp" },
    { n: "Chocolate Cookies", d: "Chewy chocolate cookies", p: 150, img: "/images/menu-cut/chocolate-cookies.webp" },
    { n: "Vanilla Cookies", d: "Classic vanilla cookies", p: 150, img: "/images/menu-cut/vanilla-cookies.webp" },
    { n: "Extra Bun", d: "Soft bun on the side", p: 60, img: "/images/menu-cut/extra-bun.webp" },
  ]},
  { id: "drinks", name: "Beverages & Drinks", script: "Chill", glyph: "glass", items: [
    { n: "Mint Margarita", d: "Fresh mint and lemon, blended icy", p: 280, img: "/images/menu-cut/mint-margarita.webp" },
    { n: "Blue Lagoon Mocktail", d: "Blue curaçao mocktail with lemon", p: 260, img: "/images/menu-cut/blue-lagoon-mocktail.webp" },
    { n: "Lemonade", d: "Fresh squeezed lemonade", p: 220, img: "/images/menu-cut/lemonade.webp" },
    { n: "Diet Zeera Masala", d: "Spiced cumin soda", p: 280 },
    { n: "Regular Drink", d: "Soft drink, regular", p: 100, img: "/images/menu-cut/regular-drink.webp" },
    { n: "Drink 500 ml", d: "Soft drink, 500 ml bottle", p: 130, img: "/images/menu-cut/drink-500-ml.webp" },
    { n: "Drinking Water (½ Litre)", d: "Mineral water", p: 70, img: "/images/menu-cut/drinking-water-1-5-litre.webp" },
    { n: "Drinking Water (1.5 Litre)", d: "Mineral water", p: 160, img: "/images/menu-cut/drinking-water-1-5-litre.webp" },
  ]},
  { id: "addons", name: "Add-ons", script: "Make it yours", glyph: "plus", items: [
    { n: "Cheese Slice", d: "Add to any burger or doner", p: 70, img: "/images/menu-cut/cheese-slice.webp" },
    { n: "Garlic Sauce", d: "Our regular garlic dip", p: 70, img: "/images/menu-cut/garlic-sauce.webp" },
    { n: "Spicy Garlic", d: "Garlic dip with a kick", p: 70, img: "/images/menu-cut/spicy-garlic.webp" },
  ]},
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Flatten with stable ids, e.g. "broast-half-broast"
export const ITEMS = MENU.flatMap((c) =>
  c.items.map((it) => ({
    ...it,
    id: `${c.id}-${slug(it.n)}`,
    category: c.id,
    categoryName: c.name,
    glyph: it.glyph || c.glyph,
  }))
);

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const priceOf = (item, size) =>
  item.sizes ? item.sizes[size] ?? Object.values(item.sizes)[0] : item.p;

export const defaultSize = (item) => (item.sizes ? Object.keys(item.sizes)[0] : null);

export const imgSrc = (item) => item.img || null; // e.g. "/images/menu-cut/half-broast.webp"

export const POPULAR = ITEMS.filter((i) => i.popular);

export const formatPKR = (n) => "Rs. " + Number(n || 0).toLocaleString("en-PK");
