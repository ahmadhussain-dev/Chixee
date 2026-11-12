import mongoose, { Schema } from "mongoose";

// One document (key "store") with payment details shown at checkout.
const SettingSchema = new Schema(
  {
    key: { type: String, unique: true, default: "store" },
    bankName: { type: String, default: "" },
    accountTitle: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    iban: { type: String, default: "" },
    jazzcashNumber: { type: String, default: "" },
    jazzcashTitle: { type: String, default: "" },
    acceptingOrders: { type: Boolean, default: true },
    catalogSeeded: { type: Boolean, default: false }, // the starting menu has been copied into the database once
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
