import { Router, type Request, type Response } from "express";
import Student from "../models/Student";
import { requireStudent } from "../middlewares/studentAuth";
import { requireAdmin } from "../middlewares/adminAuth";

const router = Router();
//  GET /api/student/me  (Student only)
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
//  ADMIN: GET /api/student/admin/list?rollNo=RADHE001
// Authorization: Bearer <ADMIN_TOKEN>
router.get("/admin/list", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rollNo = String(req.query?.rollNo || "").trim();

    const filter: any = {};
    if (rollNo) filter.rollNo = rollNo;

    const students = await Student.find(filter).sort({ createdAt: -1 }).lean();

    return res.json({
      total: students.length,
      students: students.map((s: any) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
        photoUrl: s.photoUrl || "",
        foodTokens: typeof s.foodTokens === "number" ? s.foodTokens : 60,
        createdAt: s.createdAt,
      })),
    });
  } catch {
    return res.status(500).json({ message: "Failed to load students" });
  }
});

// ADMIN: POST /api/student/admin/reset-tokens
// Authorization: Bearer <ADMIN_TOKEN>
// body: { studentId: "..." }
router.post("/admin/reset-tokens", requireAdmin, async (req: Request, res: Response) => {
  try {
    const studentId = String(req.body?.studentId || "").trim();
    if (!studentId) return res.status(400).json({ message: "studentId is required" });

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { $set: { foodTokens: 60 } },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Student not found" });
    return res.json({
      message: "Tokens reset to 60",
      student: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        rollNo: updated.rollNo,
        photoUrl: updated.photoUrl || "",
        foodTokens: updated.foodTokens,
      },
    });
  } catch {
    return res.status(500).json({ message: "Failed to reset tokens" });
  }
});
export default router;
