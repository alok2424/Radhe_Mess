import { Router, type Request, type Response } from "express";
import Attendance from "../models/Attendance";

const router = Router();

function getISTDateKey(date = new Date()) {
  // Convert to IST dateKey YYYY-MM-DD without external libs
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

// GET /api/attendance/today-count
router.get("/today-count", async (_req: Request, res: Response) => {
  const dateKey = getISTDateKey();
  const count = await Attendance.countDocuments({ dateKey });
  res.json({ dateKey, presentCount: count });
});

// POST /api/attendance/mark
// body: { rollNo: "123" }
router.post("/mark", async (req: Request, res: Response) => {
  const rollNo = String(req.body?.rollNo || "").trim();
  if (!rollNo) {
    return res.status(400).json({ message: "rollNo is required" });
  }

  const dateKey = getISTDateKey();

  try {
    const doc = await Attendance.create({
      studentRollNo: rollNo,
      dateKey,
      markedAt: new Date(),
    });

    return res.status(201).json({
      message: "Attendance marked",
      attendance: {
        id: doc._id,
        rollNo: doc.studentRollNo,
        dateKey: doc.dateKey,
        markedAt: doc.markedAt,
      },
    });
  } catch (err: any) {
    // Duplicate attendance (unique index)
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Attendance already marked today" });
    }
    return res.status(500).json({ message: "Failed to mark attendance" });
  }
});

export default router;
