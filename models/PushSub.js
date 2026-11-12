import mongoose, { Schema } from "mongoose";

// A browser that agreed to notifications (Web Push).
// role "admin": gets a notification for every new order. role "customer": gets updates for the orders listed.
const PushSubSchema = new Schema(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: { p256dh: { type: String, required: true }, auth: { type: String, required: true } },
    role: { type: String, enum: ["admin", "customer"], default: "customer", index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    orders: { type: [String], default: [], index: true }, // order codes this browser follows
  },
  { timestamps: true }
);

export default mongoose.models.PushSub || mongoose.model("PushSub", PushSubSchema);
