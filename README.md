# Chixee Broast website

Online ordering site for Chixee Broast, Kohinoor City, Faisalabad. Built with Next.js (App Router, JavaScript), Tailwind CSS, NextAuth, MongoDB and Resend.

## What's included

- **Location popup on first visit**: Delivery or Pick-Up, city, and a searchable delivery-area list with ETA. The header location button reopens it.
- **Menu** with category tabs, search, size options and Add To Cart.
- **Cart** that works for guests (saved in the browser), with a fixed cart button bottom-right showing the item count, and a slide-out cart panel.
- **Checkout**: name, mobile, optional email and alternative number, saved addresses for signed-in customers (name and phone are filled in automatically and can be changed), special instructions, Cash on Delivery or Account Transfer (bank / JazzCash details plus transaction ID), and Place Order. Prices are recalculated on the server from `data/menu.js`.
- **Order tracking** page that refreshes every 15 seconds: pending → accepted → preparing → ready → rider on the way (with rider name and number) → delivered. Signed-in customers also get **My orders**.
- **Accounts**: sign up, sign in with email or mobile number, forgot password and reset password by email (Resend). Reset links expire after 30 minutes and work once.
- **Admin panel** at `/admin` (admin accounts only): live orders with Accept / Start preparing / Food is ready / Dispatch with rider details / Mark delivered / Cancel, payment verification for transfers, daily / weekly / monthly reports (revenue, items sold with prices, COD vs online), delivery areas (name, ETA, fee, active), and payment details.
- **SEO**: page metadata, Open Graph, `sitemap.xml`, `robots.txt`, web manifest and Restaurant + Menu structured data.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run seed                 # creates the admin account and the starting delivery areas
npm run dev                  # http://localhost:3000
```

`.env.local` needs:

| Variable | What it is |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Any long random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, your domain in production |
| `RESEND_API_KEY`, `EMAIL_FROM` | For reset-password emails. Without a key, the reset link is printed in the server console. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_PASSWORD` | Used once by `npm run seed` to create the admin login |

## Images

Image paths are intentionally empty for now, and branded yellow placeholders show instead.

- Logo, hero banners, storefront and share image: set the paths in `data/images.js`.
- Menu items: set each item's `img` in `data/menu.js`, e.g. `img: "/images/menu/half-broast.jpg"`.
- Put the files in `public/images/`.

## Where things live

```
app/(shop)/        public pages (home, checkout, order tracking, auth, about, contact)
app/admin/         admin panel pages
app/api/           API routes (auth, orders, areas, settings, admin)
components/        UI components grouped by area (layout, menu, cart, checkout, auth, admin, home, location)
context/           cart, location and toast state
data/              site details, menu and prices, image paths
lib/               database, auth, validation, email helpers
models/            Mongoose models (User, Order, Area, Setting)
scripts/seed.mjs   admin + delivery area seeding
```

## Deploying to Vercel

Import the repo in Vercel, add the same environment variables (with your real domain in `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`), and in MongoDB Atlas allow connections from Vercel (Network Access).
