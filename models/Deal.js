import mongoose, { Schema } from "mongoose";

// A deal built from menu items, managed from /admin/deals. The customer pays `p`; the "was" price is the menu total of `parts`.
const PartSchema = new Schema(
  { item: { type: String, required: true }, qty: { type: Number, default: 1, min: 1 }, size: { type: String, default: "" } },
  { _id: false }
);

const DealSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    group: { type: String, required: true }, // today | weekly | combos | family | late (data/deals.js)
    n: { type: String, required: true, trim: true },
    p: { type: Number, required: true, min: 0 },
    serves: { type: Number, default: 1, min: 1 },
    when: { type: String, default: "", trim: true },
    badge: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    img: { type: String, default: "" },
    parts: { type: [PartSchema], default: [] },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Deal || mongoose.model("Deal", DealSchema);
