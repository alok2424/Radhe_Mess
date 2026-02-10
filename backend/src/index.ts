import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

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
