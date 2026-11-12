import mongoose, { Schema } from "mongoose";

// Counters for rate limiting (lib/rateLimit.js). MongoDB deletes each one when its window ends.
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  resetAt: { type: Date, required: true, expires: 0 },
});

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
