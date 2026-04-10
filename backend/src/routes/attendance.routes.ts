import { Router, type Request, type Response } from "express";
import Attendance from "../models/Attendance";
import Student from "../models/Student";
import Food from "../models/Food";
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
// const LUNCH_MARK_END = 11 * 60 + 30; // 11:30
 const LUNCH_MARK_END = 11 * 60 + 60;//11:00am
// const DINNER_MARK_START = 17 * 60 + 30; // 5:30pm
const DINNER_MARK_START = 17 * 60 ; // 5:00pm
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
      message: `Attendance for LUNCH can be marked between ${formatTimeLabel(11, 0)}-${formatTimeLabel(12,0)}.`,
    };
  }

  if (mins >= LUNCH_MARK_END && mins < DINNER_MARK_START) {
    return {
      allowed: false,
      message: `Attendance for DINNER can be marked between ${formatTimeLabel(17, 0)}-${formatTimeLabel(18, 0)}.`,
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

  // const LUNCH_SERVICE_START = 11 * 60 + 30; // 11:30
  const LUNCH_SERVICE_START = 11 * 60 ; // 11:00
  const LUNCH_SERVICE_END = 15 * 60; // 3:00pm
  const DINNER_SERVICE_START = 18 * 60; // 6:00pm
  const DINNER_SERVICE_END = 22 * 60; // 10:00pm

  let mealType: "LUNCH" | "DINNER" | null = null;
  if (mins >= LUNCH_SERVICE_START && mins < LUNCH_SERVICE_END) mealType = "LUNCH";
  else if (mins >= DINNER_SERVICE_START && mins < DINNER_SERVICE_END) mealType = "DINNER";

  const count = mealType ? await Attendance.countDocuments({ dateKey, mealType }) : 0;
  res.json({ dateKey, presentCount: count, mealType });
});

/**
 * POST /api/attendance/mark
 * STUDENT ONLY + token reduce + food selection (1–3) + store in DB
 * Body: { selectedFoods: string[] }
 */
router.post("/mark", requireStudent, async (req: Request, res: Response) => {
  const studentEmail = String((req as any).student?.email || "").toLowerCase();
  const tokenRollNo = String((req as any).student?.rollNo || "").trim();

  if (!studentEmail || !tokenRollNo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //  1) Validate selectedFoods (1–3)
  const raw = req.body?.selectedFoods;
  const picked = Array.isArray(raw)
    ? raw.map((x) => String(x || "").trim()).filter(Boolean)
    : [];

  // remove duplicates case-insensitively
  const seen = new Set<string>();
  const selectedFoods: string[] = [];
  for (const item of picked) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      selectedFoods.push(item);
    }
  }

  if (selectedFoods.length < 1) {
    return res.status(400).json({ message: "Please select at least 1 food item." });
  }

  if (selectedFoods.length > 3) {
    return res.status(400).json({ message: "You can select maximum 3 food items." });
  }

  //2) Validate against today's menu
  const dateKey = getISTDateKey();
  const menuDoc = await Food.findOne({ dateKey }).lean();

  const menuNames =
    menuDoc?.items?.map((it: any) => String(it?.name || "").trim()).filter(Boolean) || [];

  if (menuNames.length === 0) {
    return res.status(400).json({ message: "Today's menu is not available. Contact admin." });
  }

  const menuSet = new Set(menuNames.map((n) => n.toLowerCase()));
  for (const f of selectedFoods) {
    if (!menuSet.has(f.toLowerCase())) {
      return res
        .status(400)
        .json({ message: `Invalid selection: "${f}". Choose from today's menu.` });
    }
  }

  // existing rule: meal timing allowed
  const allowed = getAllowedMealToMark();
  if (!allowed.allowed) return res.status(403).json({ message: allowed.message });

  // decrement only if tokens > 0
  const student = await Student.findOneAndUpdate(
    { email: studentEmail, foodTokens: { $gt: 0 } },
    { $inc: { foodTokens: -1 } },
    { new: true }
  ).lean();

  if (!student) {
    return res.status(403).json({ message: "No tokens left. Please contact admin." });
  }

  try {
    // create attendance with selectedFoods stored
    const doc = await Attendance.create({
      studentRollNo: tokenRollNo, // ✅ from token
      dateKey,
      mealType: allowed.mealType,
      markedAt: new Date(),
      selectedFoods,
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
        selectedFoods: doc.selectedFoods,
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

// ADMIN: GET /api/attendance/analytics/daily
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

/**
 * ADMIN: GET /api/attendance/analytics/top-food?month=YYYY-MM
 * Returns TOP 3 most selected food items in that month.
 */
router.get("/analytics/top-food", requireAdmin, async (req: Request, res: Response) => {
  const month = String(req.query?.month || "").trim(); // YYYY-MM

  const nowKey = getISTDateKey(new Date()); // YYYY-MM-DD
  const currentMonth = nowKey.slice(0, 7); // YYYY-MM
  const monthKey = month || currentMonth;

  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return res.status(400).json({ message: "Invalid month. Use YYYY-MM (e.g. 2026-02)" });
  }

  const fromKey = `${monthKey}-01`;

  const [yy, mm] = monthKey.split("-").map(Number);
  const lastDay = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  const toKey = `${monthKey}-${String(lastDay).padStart(2, "0")}`;

  const agg = await Attendance.aggregate([
    { $match: { dateKey: { $gte: fromKey, $lte: toKey } } },
    { $unwind: "$selectedFoods" },
    {
      $group: {
        _id: { $toLower: "$selectedFoods" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  const top3 = agg.map((x) => ({
    foodName: String(x._id),
    count: Number(x.count || 0),
  }));

  return res.json({
    month: monthKey,
    from: fromKey,
    to: toKey,
    top3,
  });
});

export default router;




