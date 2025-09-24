import mongoose from "mongoose";

const { Schema } = mongoose;

const STATUS = ["ZU_LESEN", "LESE", "GELESEN", "ABGEBROCHEN"];

const buchSchema = new Schema(
  {
    titel: { type: String, required: true, trim: true },
    autoren: [{ type: String, trim: true }],
    status: { type: String, enum: STATUS, default: "ZU_LESEN" },
    bewertung: { type: Number, min: 0, max: 5, default: null },
    notizen: { type: String, trim: true, maxlength: 2000 },
    besitzer: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Buch = mongoose.model("Buch", buchSchema, "books");