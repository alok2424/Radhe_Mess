import { Router, type Request, type Response } from "express";
import Food from "../models/Food";

const router = Router();

function getISTDateKey(date = new Date()) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

// GET /api/food/today
router.get("/today", async (_req: Request, res: Response) => {
  const dateKey = getISTDateKey();

  const doc = await Food.findOne({ dateKey }).lean();

  // If no menu found, return a default (frontend can still work)
  if (!doc) {
    return res.json({
      dateKey,
      items: [
        {
          name: "Paneer Butter Masala",
          imageUrl:
            "https://images.unsplash.com/photo-1604908177225-6c8f2d55f6a3?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Dal Tadka",
          imageUrl:
            "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Jeera Rice",
          imageUrl:
            "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Roti / Naan",
          imageUrl:
            "https://images.unsplash.com/photo-1610192244261-3f33de3f3d2f?auto=format&fit=crop&w=1200&q=80",
        },
        {
          name: "Gulab Jamun",
          imageUrl:
            "https://images.unsplash.com/photo-1601050690597-3b2b3ccaa8a5?auto=format&fit=crop&w=1200&q=80",
        },
      ],
      source: "default",
    });
  }

  return res.json({
    dateKey,
    items: doc.items,
    source: "db",
  });
});

export default router;
