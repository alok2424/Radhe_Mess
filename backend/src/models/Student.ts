import mongoose, { Schema, type InferSchemaType } from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export type StudentDocument = InferSchemaType<typeof studentSchema>;
export default mongoose.model("Student", studentSchema);
