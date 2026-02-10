// import { Router, type Request, type Response } from "express";
// import Food from "../models/Food";

// const router = Router();

// function getISTDateKey(date = new Date()) {
//   const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
//   return ist.toISOString().slice(0, 10);
// }

// // GET /api/food/today
// router.get("/today", async (_req: Request, res: Response) => {
//   const dateKey = getISTDateKey();

//   const doc = await Food.findOne({ dateKey }).lean();

//   // If no menu found, return a default (frontend can still work)
//   if (!doc) {
//     return res.json({
//       dateKey,
//       items: [
//         {
//           name: "Paneer Butter Masala",
//           imageUrl:
//             "https://images.unsplash.com/photo-1604908177225-6c8f2d55f6a3?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           name: "Dal Tadka",
//           imageUrl:
//             "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           name: "Jeera Rice",
//           imageUrl:
//             "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           name: "Roti / Naan",
//           imageUrl:
//             "https://images.unsplash.com/photo-1610192244261-3f33de3f3d2f?auto=format&fit=crop&w=1200&q=80",
//         },
//         {
//           name: "Gulab Jamun",
//           imageUrl:
//             "https://images.unsplash.com/photo-1601050690597-3b2b3ccaa8a5?auto=format&fit=crop&w=1200&q=80",
//         },
//       ],
//       source: "default",
//     });
//   }

//   return res.json({
//     dateKey,
//     items: doc.items,
//     source: "db",
//   });
// });

// export default router;
import { Router, type Request, type Response } from "express";
import Food from "../models/Food";

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

// PUT /api/food/today  (Admin only)
// Header: x-admin-key: <ADMIN_API_KEY>
// Body: { items: [{name, imageUrl?}, ...] }
router.put("/today", async (req: Request, res: Response) => {
  const adminKey = req.header("x-admin-key") || "";
  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({ message: "ADMIN_API_KEY is not configured" });
  }
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const items = req.body?.items;

  if (!Array.isArray(items) || items.length !== 5) {
    return res
      .status(400)
      .json({ message: "items must be an array of exactly 5 items" });
  }

  // sanitize + validate
  for (const it of items) {
    const name = String(it?.name || "").trim();
    let imageUrl = String(it?.imageUrl || "").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Each item needs a valid name" });
    }

    // ✅ imageUrl optional:
    // - if empty -> default
    // - if provided -> must be valid http/https URL
    if (!imageUrl) {
      imageUrl = DEFAULT_IMAGE_URL;
    } else if (!isValidUrl(imageUrl)) {
      return res
        .status(400)
        .json({ message: "imageUrl must be a valid http/https URL (or leave it empty)" });
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

