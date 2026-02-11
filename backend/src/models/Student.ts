import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    foodTokens: { type: Number, default: 60, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
