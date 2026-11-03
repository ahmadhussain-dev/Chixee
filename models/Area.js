import mongoose, { Schema } from "mongoose";

const AreaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, default: "Faisalabad" },
    eta: { type: Number, default: 45 }, // minutes
    fee: { type: Number, default: 150 }, // delivery fee in Rs.
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
AreaSchema.index({ city: 1, name: 1 }, { unique: true });

export default mongoose.models.Area || mongoose.model("Area", AreaSchema);
