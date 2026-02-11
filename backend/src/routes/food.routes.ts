
import { Router, type Request, type Response } from "express";
import Food from "../models/Food";
import { requireAdmin } from "../middlewares/adminAuth";

const router = Router();

function getISTDateKey(date = new Date()) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function isValidUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

// GET /api/food/today
router.get("/today", async (_req: Request, res: Response) => {
  const dateKey = getISTDateKey();
  const doc = await Food.findOne({ dateKey }).lean();

  if (!doc) {
    return res.json({
      dateKey,
      items: [
        { name: "Paneer Butter Masala", imageUrl: DEFAULT_IMAGE_URL },
        { name: "Dal Tadka", imageUrl: DEFAULT_IMAGE_URL },
        { name: "Jeera Rice", imageUrl: DEFAULT_IMAGE_URL },
        { name: "Roti / Naan", imageUrl: DEFAULT_IMAGE_URL },
        { name: "Gulab Jamun", imageUrl: DEFAULT_IMAGE_URL },
      ],
      source: "default",
    });
  }

  return res.json({ dateKey, items: doc.items, source: "db" });
});

// ✅ PUT /api/food/today (Admin Only)
// Authorization: Bearer <ADMIN_TOKEN>
router.put("/today", requireAdmin, async (req: Request, res: Response) => {
  const items = req.body?.items;

  if (!Array.isArray(items) || items.length !== 5) {
    return res.status(400).json({ message: "items must be an array of exactly 5 items" });
  }

  for (const it of items) {
    const name = String(it?.name || "").trim();
    let imageUrl = String(it?.imageUrl || "").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Each item needs a valid name" });
    }

    // imageUrl optional
    if (!imageUrl) imageUrl = DEFAULT_IMAGE_URL;
    else if (!isValidUrl(imageUrl)) {
      return res
        .status(400)
        .json({ message: "imageUrl must be valid http/https (or leave empty)" });
    }

    it.name = name;
    it.imageUrl = imageUrl;
  }

  const dateKey = getISTDateKey();

  const updated = await Food.findOneAndUpdate(
    { dateKey },
    { $set: { dateKey, items } },
    { upsert: true, new: true }
  ).lean();

  return res.json({
    message: "Today's menu updated",
    dateKey,
    items: updated?.items || items,
  });
});

export default router;


