import mongoose, { Schema, type InferSchemaType } from "mongoose";

const attendanceSchema = new Schema(
  {
    studentRollNo: { type: String, required: true, trim: true },
    dateKey: { type: String, required: true }, // YYYY-MM-DD (local/IST)
    markedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicates: 1 student can mark only once per day
attendanceSchema.index({ studentRollNo: 1, dateKey: 1 }, { unique: true });

export type AttendanceDocument = InferSchemaType<typeof attendanceSchema>;
export default mongoose.model("Attendance", attendanceSchema);
