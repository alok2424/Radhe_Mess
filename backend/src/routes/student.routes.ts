import { Router, type Request, type Response } from "express";
import Student from "../models/Student";
import { requireStudent } from "../middlewares/studentAuth";

const router = Router();

// ✅ GET /api/student/me  (Student only)
router.get("/me", requireStudent, async (req: Request, res: Response) => {
  const email = String((req as any).student?.email || "").toLowerCase();
  if (!email) return res.status(401).json({ message: "Unauthorized" });

  const student = await Student.findOne({ email }).lean();
  if (!student) return res.status(404).json({ message: "Student not found" });

  return res.json({
    email: student.email,
    name: student.name,
    rollNo: student.rollNo,
    photoUrl: student.photoUrl || "",
    foodTokens: student.foodTokens ?? 0,
  });
});

export default router;
