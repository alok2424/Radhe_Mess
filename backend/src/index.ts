import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { signAdminToken } from "./middlewares/adminAuth";
import { signStudentToken } from "./middlewares/studentAuth";

import attendanceRoutes from "./routes/attendance.routes";
import foodRoutes from "./routes/food.routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 7000;

async function start() {
  const mongo = process.env.MONGODB_CONNECTION_STRING;
  if (!mongo) {
    console.error("❌ Missing MONGODB_CONNECTION_STRING in .env");
    process.exit(1);
  }

  await mongoose.connect(mongo);
  console.log("✅ Connected to DB");

  const app = express();

  // middlewares
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173", // allow all origins in dev; tighten in prod
      credentials: true,
    })
  );

  //admin login
app.post("/api/admin/login", (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "").trim();

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_JWT_SECRET) {
    return res.status(500).json({ message: "Admin auth env not configured" });
  }

  if (
    email !== process.env.ADMIN_EMAIL.toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const token = signAdminToken({ role: "admin", email, exp }, process.env.ADMIN_JWT_SECRET);

  return res.json({ token });
});


//Student login
app.post("/api/student/login", (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "").trim();

  if (!process.env.STUDENT_EMAIL || !process.env.STUDENT_PASSWORD || !process.env.STUDENT_JWT_SECRET) {
    return res.status(500).json({ message: "Student auth env not configured" });
  }

  if (
    email !== process.env.STUDENT_EMAIL.toLowerCase() ||
    password !== process.env.STUDENT_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid student credentials" });
  }

  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const token = signStudentToken({ role: "student", email, exp }, process.env.STUDENT_JWT_SECRET);

  return res.json({ token });
});

  // health check
  app.get("/test", async (_req: Request, res: Response) => {
    res.json({ message: "Hello" });
  });

  // api routes
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/food", foodRoutes);

  // 404
  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});
