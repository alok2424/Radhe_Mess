import mongoose, { Schema, type InferSchemaType } from "mongoose";

const foodItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const foodSchema = new Schema(
  {
    dateKey: { type: String, required: true, unique: true }, // YYYY-MM-DD
    items: { type: [foodItemSchema], required: true, default: [] },
  },
  { timestamps: true }
);

export type FoodDocument = InferSchemaType<typeof foodSchema>;
export default mongoose.model("Food", foodSchema);
