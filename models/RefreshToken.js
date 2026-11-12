import mongoose, { Schema } from "mongoose";

// Refresh tokens (lib/tokens.js). Only a hash is stored. Every sign-in starts a "family"; each refresh
// replaces the token with a new one in the same family. Reusing an old token revokes the whole family.
const RefreshTokenSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 }, // MongoDB deletes it after this
    usedAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
    replacedByEnc: { type: String, default: "" }, // the replacement, encrypted, for parallel requests (see rotate)
  },
  { timestamps: true }
);

export default mongoose.models.RefreshToken || mongoose.model("RefreshToken", RefreshTokenSchema);
