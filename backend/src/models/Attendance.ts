import mongoose, { Schema, type InferSchemaType } from "mongoose";

const attendanceSchema = new Schema(
  {
    studentRollNo: { type: String, required: true, trim: true },
    dateKey: { type: String, required: true }, // YYYY-MM-DD (IST)
    mealType: { type: String, required: true, enum: ["LUNCH", "DINNER"] },
    markedAt: { type: Date, required: true, default: Date.now },

    //NEW: store student's selected foods (1 to 3 items)
    selectedFoods: { type: [String], default: [], maxlength: 3 },
  },
  { timestamps: true }
);

//Unique per student per meal per day (allows lunch + dinner both): compound index
attendanceSchema.index({ studentRollNo: 1, dateKey: 1, mealType: 1 }, { unique: true });

export type AttendanceDocument = InferSchemaType<typeof attendanceSchema>;
export default mongoose.model("Attendance", attendanceSchema);

