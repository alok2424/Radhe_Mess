// import { Router, type Request, type Response } from "express";
// import Attendance from "../models/Attendance";

// const router = Router();

// function getISTDateKey(date = new Date()) {
//   // Convert to IST dateKey YYYY-MM-DD without external libs
//   const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
//   return ist.toISOString().slice(0, 10);
// }

// // GET /api/attendance/today-count
// router.get("/today-count", async (_req: Request, res: Response) => {
//   const dateKey = getISTDateKey();
//   const count = await Attendance.countDocuments({ dateKey });
//   res.json({ dateKey, presentCount: count });
// });

// // POST /api/attendance/mark
// // body: { rollNo: "123" }
// router.post("/mark", async (req: Request, res: Response) => {
//   const rollNo = String(req.body?.rollNo || "").trim();
//   if (!rollNo) {
//     return res.status(400).json({ message: "rollNo is required" });
//   }

//   const dateKey = getISTDateKey();

//   try {
//     const doc = await Attendance.create({
//       studentRollNo: rollNo,
//       dateKey,
//       markedAt: new Date(),
//     });

//     return res.status(201).json({
//       message: "Attendance marked",
//       attendance: {
//         id: doc._id,
//         rollNo: doc.studentRollNo,
//         dateKey: doc.dateKey,
//         markedAt: doc.markedAt,
//       },
//     });
//   } catch (err: any) {
//     // Duplicate attendance (unique index)
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "Attendance already marked today" });
//     }
//     return res.status(500).json({ message: "Failed to mark attendance" });
//   }
// });

// export default router;
//import { Router, type Request, type Response } from "express";
import { Router, type Request, type Response } from "express";
import Attendance from "../models/Attendance";
import Student from "../models/Student";
import { requireAdmin } from "../middlewares/adminAuth";
import { requireStudent } from "../middlewares/studentAuth";

const router = Router();

function getISTNow() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000);
}

function getISTDateKey(date = new Date()) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function minutesSinceMidnightIST() {
  const ist = getISTNow();
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}

function formatTimeLabel(h: number, m: number) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(" ", "")
    .toLowerCase();
}

// Attendance marking windows (IST)
const LUNCH_MARK_START = 11 * 60; // 11:00
const LUNCH_MARK_END = 11 * 60 + 30; // 11:30
const DINNER_MARK_START = 17 * 60 + 30; // 5:30pm
const DINNER_MARK_END = 18 * 60; // 6:00pm

function getAllowedMealToMark():
  | { allowed: true; mealType: "LUNCH" | "DINNER" }
  | { allowed: false; message: string } {
  const mins = minutesSinceMidnightIST();

  if (mins >= LUNCH_MARK_START && mins < LUNCH_MARK_END) return { allowed: true, mealType: "LUNCH" };
  if (mins >= DINNER_MARK_START && mins < DINNER_MARK_END) return { allowed: true, mealType: "DINNER" };

  if (mins < LUNCH_MARK_START) {
    return {
      allowed: false,
      message: `Attendance for LUNCH can be marked between ${formatTimeLabel(11, 0)}-${formatTimeLabel(11, 30)}.`,
    };
  }

  if (mins >= LUNCH_MARK_END && mins < DINNER_MARK_START) {
    return {
      allowed: false,
      message: `Attendance for DINNER can be marked between ${formatTimeLabel(17, 30)}-${formatTimeLabel(18, 0)}.`,
    };
  }

  if (mins >= DINNER_MARK_END) {
    return {
      allowed: false,
      message: `Attendance marking is closed now. Next LUNCH window is ${formatTimeLabel(11, 0)}-${formatTimeLabel(11, 30)}.`,
    };
  }

  return { allowed: false, message: "Attendance marking is not allowed right now." };
}

// GET /api/attendance/today-count
router.get("/today-count", async (_req: Request, res: Response) => {
  const dateKey = getISTDateKey();
  const mins = minutesSinceMidnightIST();

  const LUNCH_SERVICE_START = 11 * 60 + 30; // 11:30
  const LUNCH_SERVICE_END = 15 * 60; // 3:00pm
  const DINNER_SERVICE_START = 18 * 60; // 6:00pm
  const DINNER_SERVICE_END = 22 * 60; // 10:00pm

  let mealType: "LUNCH" | "DINNER" | null = null;
  if (mins >= LUNCH_SERVICE_START && mins < LUNCH_SERVICE_END) mealType = "LUNCH";
  else if (mins >= DINNER_SERVICE_START && mins < DINNER_SERVICE_END) mealType = "DINNER";

  const count = mealType ? await Attendance.countDocuments({ dateKey, mealType }) : 0;
  res.json({ dateKey, presentCount: count, mealType });
});

// ✅ POST /api/attendance/mark (STUDENT ONLY + token reduce)
router.post("/mark", requireStudent, async (req: Request, res: Response) => {
  const studentEmail = String((req as any).student?.email || "").toLowerCase();
  const tokenRollNo = String((req as any).student?.rollNo || "").trim();

  if (!studentEmail || !tokenRollNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const allowed = getAllowedMealToMark();
  if (!allowed.allowed) return res.status(403).json({ message: allowed.message });

  const dateKey = getISTDateKey();

  // ✅ decrement only if tokens > 0
  const student = await Student.findOneAndUpdate(
    { email: studentEmail, foodTokens: { $gt: 0 } },
    { $inc: { foodTokens: -1 } },
    { new: true }
  ).lean();

  if (!student) {
    return res.status(403).json({ message: "No tokens left. Please contact admin." });
  }

  try {
    // ✅ create attendance
    const doc = await Attendance.create({
      studentRollNo: tokenRollNo, // ✅ from token
      dateKey,
      mealType: allowed.mealType,
      markedAt: new Date(),
    });

    return res.status(201).json({
      message: `${allowed.mealType} attendance marked`,
      tokensLeft: student.foodTokens,
      attendance: {
        id: doc._id,
        rollNo: doc.studentRollNo,
        dateKey: doc.dateKey,
        mealType: doc.mealType,
        markedAt: doc.markedAt,
      },
    });
  } catch (err: any) {
    // duplicate => revert token
    if (err?.code === 11000) {
      await Student.updateOne({ email: studentEmail }, { $inc: { foodTokens: +1 } });
      return res.status(409).json({ message: `${allowed.mealType} attendance already marked today` });
    }

    // any error => revert token
    await Student.updateOne({ email: studentEmail }, { $inc: { foodTokens: +1 } });
    return res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// ✅ ADMIN: GET /api/attendance/analytics/daily
router.get("/analytics/daily", requireAdmin, async (req: Request, res: Response) => {
  const from = String(req.query?.from || "").trim();
  const to = String(req.query?.to || "").trim();

  const today = getISTDateKey(new Date());
  const defaultTo = today;

  const defaultFrom = (() => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 13);
    return d.toISOString().slice(0, 10);
  })();

  const fromKey = from || defaultFrom;
  const toKey = to || defaultTo;

  const days: string[] = [];
  {
    const start = new Date(`${fromKey}T00:00:00Z`);
    const end = new Date(`${toKey}T00:00:00Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid from/to date format. Use YYYY-MM-DD" });
    }
    if (start > end) {
      return res.status(400).json({ message: "`from` must be <= `to`" });
    }

    const cur = new Date(start);
    while (cur <= end) {
      days.push(cur.toISOString().slice(0, 10));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  const agg = await Attendance.aggregate([
    { $match: { dateKey: { $gte: fromKey, $lte: toKey } } },
    {
      $group: {
        _id: { dateKey: "$dateKey", mealType: "$mealType" },
        count: { $sum: 1 },
      },
    },
  ]);

  const map = new Map<string, { lunch: number; dinner: number }>();
  for (const row of agg) {
    const dateKey = row?._id?.dateKey as string;
    const mealType = row?._id?.mealType as "LUNCH" | "DINNER";
    const count = row?.count as number;

    const cur = map.get(dateKey) || { lunch: 0, dinner: 0 };
    if (mealType === "LUNCH") cur.lunch = count;
    if (mealType === "DINNER") cur.dinner = count;
    map.set(dateKey, cur);
  }

  const resultDays = days.map((d) => {
    const v = map.get(d) || { lunch: 0, dinner: 0 };
    return {
      dateKey: d,
      lunchCount: v.lunch,
      dinnerCount: v.dinner,
      total: v.lunch + v.dinner,
    };
  });

  return res.json({ from: fromKey, to: toKey, days: resultDays });
});

export default router;



