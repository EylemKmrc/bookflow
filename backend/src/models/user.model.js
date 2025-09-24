import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

// Passwort setzen
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

// Passwort prüfen
userSchema.methods.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);