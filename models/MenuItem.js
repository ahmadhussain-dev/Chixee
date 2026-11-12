import mongoose, { Schema } from "mongoose";

// One dish on the menu, managed from /admin/menu.
// key: stable id used by carts and orders ("burgers-majestic-double"); it never changes, even if the name does.
// Price: either `p` (one price) or `sizes` (e.g. Small / Regular / Large). `meal` adds the fries / drink upgrades,
// `flavours` lists drink flavours at the same price.
const SizeSchema = new Schema({ name: { type: String, required: true, trim: true }, price: { type: Number, required: true, min: 0 } }, { _id: false });

const MenuItemSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    n: { type: String, required: true, trim: true },
    d: { type: String, default: "", trim: true },
    p: { type: Number, default: null, min: 0 },
    sizes: { type: [SizeSchema], default: [] },
    meal: { type: Boolean, default: false },
    flavours: { type: [String], default: [] },
    tag: { type: String, default: "", trim: true },
    popular: { type: Boolean, default: false },
    img: { type: String, default: "" },
    active: { type: Boolean, default: true }, // false = hidden from the menu (sold out / off the menu)
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
