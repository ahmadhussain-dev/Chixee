// Creates the first admin account and the starting delivery-area list.
// Run with: npm run seed   (reads .env.local)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_NAME = "Chixee Admin", ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI) throw new Error("Set MONGODB_URI in .env.local");

// Starting list for Faisalabad. ETA (minutes) and fee (Rs.) are placeholders: edit them in Admin > Delivery areas.
const AREAS = [
  ["Kohinoor City", 25, 100], ["Abdullah Pur", 35, 150], ["Gulistan Colony", 35, 150], ["Jinnah Colony", 35, 150],
  ["Peoples Colony No. 1", 35, 150], ["Peoples Colony No. 2", 35, 150], ["Madina Town", 40, 150], ["Susan Road", 40, 150],
  ["Civil Lines", 40, 150], ["D Ground", 40, 150], ["Gulberg", 40, 150], ["Batala Colony", 40, 150],
  ["Samanabad", 40, 150], ["Ghulam Muhammad Abad", 45, 180], ["Raza Abad", 45, 180], ["Jaranwala Road", 30, 120],
  ["Millat Town", 40, 150], ["Allama Iqbal Colony", 40, 150], ["Saeed Colony", 40, 150], ["Officers Colony", 45, 180],
  ["Canal Road", 45, 180], ["Eden Valley", 45, 180], ["Wapda City", 50, 200], ["Faisal Town", 45, 180],
  ["Sitara Colony", 45, 180], ["Sargodha Road", 50, 200], ["Satiana Road", 45, 180], ["Painsra", 55, 220],
  ["Nishatabad", 50, 200], ["Mansoorabad", 50, 200], ["Jhang Road", 50, 200], ["Gulshan Colony", 45, 180],
  ["Muslim Town", 45, 180], ["Tariqabad", 45, 180], ["Clock Tower / 8 Bazar", 45, 180], ["Abdullah City", 50, 200],
  ["Dijkot Road", 50, 200], ["Faisal Valley", 45, 180], ["Al-Najaf Colony", 45, 180], ["Chak Jhumra Road", 55, 220],
];

await mongoose.connect(MONGODB_URI);
const db = mongoose.connection.db;

let added = 0;
for (const [name, eta, fee] of AREAS) {
  const r = await db.collection("areas").updateOne(
    { city: "Faisalabad", name },
    { $setOnInsert: { name, city: "Faisalabad", eta, fee, active: true, createdAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
  );
  if (r.upsertedCount) added++;
}
console.log(`Areas: ${added} added, ${AREAS.length - added} already there.`);

if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    await db.collection("users").updateOne({ email }, { $set: { role: "admin" } });
    console.log(`Admin: ${email} already exists, made sure it has the admin role.`);
  } else {
    await db.collection("users").insertOne({
      name: ADMIN_NAME, email, phone: ADMIN_PHONE || "", password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: "admin", addresses: [], createdAt: new Date(), updatedAt: new Date(),
    });
    console.log(`Admin: created ${email}. Sign in at /login, then open /admin.`);
  }
} else {
  console.log("Admin: skipped (set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local).");
}

await db.collection("settings").updateOne({ key: "store" }, { $setOnInsert: { key: "store", acceptingOrders: true } }, { upsert: true });
await mongoose.disconnect();
