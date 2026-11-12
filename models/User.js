import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    line: { type: String, required: true },
    area: { type: String, default: "" },
    city: { type: String, default: "Faisalabad" },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true }, // empty for Google sign-ups until they add one at checkout
    password: { type: String, select: false }, // bcrypt hash; empty for Google-only accounts
    googleId: { type: String, index: { unique: true, sparse: true } },
    image: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [AddressSchema],
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
