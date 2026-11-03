import mongoose, { Schema } from "mongoose";

export const ORDER_STATUSES = ["pending", "accepted", "preparing", "ready", "dispatched", "delivered", "cancelled"];

const LineSchema = new Schema(
  {
    itemId: String,
    name: String,
    size: String,
    price: Number,
    qty: Number,
    total: Number,
    note: String, // special instructions for this item
    ifUnavailable: String, // remove | call | cancel
  },
  { _id: false }
);

const HistorySchema = new Schema(
  { status: String, at: { type: Date, default: Date.now }, note: String },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    code: { type: String, unique: true, index: true }, // short public id, e.g. CX-7K3P9Q
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: ["delivery", "pickup"], required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: String,
      email: String,
    },
    address: { line: String, area: String, city: String },
    instructions: { type: String, default: "" },
    lines: [LineSchema],
    subtotal: Number,
    deliveryFee: { type: Number, default: 0 },
    total: Number,
    payment: {
      method: { type: String, enum: ["cod", "transfer"], default: "cod" },
      transactionId: String,
      verified: { type: Boolean, default: false },
    },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    rider: { name: String, phone: String },
    history: [HistorySchema],
  },
  { timestamps: true }
);

OrderSchema.index({ updatedAt: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
