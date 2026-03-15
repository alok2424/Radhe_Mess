// import express, { type Request, type Response } from "express";
// import cors from "cors";
// import "dotenv/config";
// import mongoose from "mongoose";
// import { signAdminToken } from "./middlewares/adminAuth";
// import { signStudentToken } from "./middlewares/studentAuth";

// import attendanceRoutes from "./routes/attendance.routes";
// import foodRoutes from "./routes/food.routes";

// import Student from "./models/Student";
// import studentRoutes from "./routes/student.routes";

// const PORT = process.env.PORT ? Number(process.env.PORT) : 7000;

// function getAllowedOrigins() {
//   const configured = String(process.env.CORS_ORIGINS || "")
//     .split(",")
//     .map((x) => x.trim())
//     .filter(Boolean);

//   // ✅ keep localhost for dev fallback
//   return configured.length ? configured : ["http://localhost:5173"];
// }

// async function start() {
//   const mongo = process.env.MONGODB_CONNECTION_STRING;
//   if (!mongo) {
//     console.error("❌ Missing MONGODB_CONNECTION_STRING in .env");
//     process.exit(1);
//   }

//   await mongoose.connect(mongo);
//   console.log("✅ Connected to DB");

//   const app = express();

//   // middlewares
//   app.use(express.json());

//   // ✅ CORS (fixes "Access-Control-Allow-Origin Missing Header")
//   const allowedOrigins = getAllowedOrigins();

//   app.use(
//     cors({
//       origin(origin, callback) {
//         // Allow non-browser clients (curl/postman) and same-origin requests with no Origin header.
//         if (!origin) return callback(null, true);

//         // ✅ allow exact matches
//         if (allowedOrigins.includes(origin)) return callback(null, true);

//         return callback(new Error(`CORS blocked for origin: ${origin}`));
//       },
//       credentials: true,
//       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//       allowedHeaders: ["Content-Type", "Authorization"],
//     })
//   );

//   // ✅ Handle preflight explicitly (helps some hosting/proxy setups)
//   app.options("*", cors());

//   // Admin login
//   app.post("/api/admin/login", (req: Request, res: Response) => {
//     const email = String(req.body?.email || "").trim().toLowerCase();
//     const password = String(req.body?.password || "").trim();

//     if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_JWT_SECRET) {
//       return res.status(500).json({ message: "Admin auth env not configured" });
//     }

//     if (email !== process.env.ADMIN_EMAIL.toLowerCase() || password !== process.env.ADMIN_PASSWORD) {
//       return res.status(401).json({ message: "Invalid admin credentials" });
//     }

//     const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
//     const token = signAdminToken({ role: "admin", email, exp }, process.env.ADMIN_JWT_SECRET);

//     return res.json({ token });
//   });

//   // Student login
//   app.post("/api/student/login", async (req: Request, res: Response) => {
//     const email = String(req.body?.email || "").trim().toLowerCase();
//     const password = String(req.body?.password || "").trim();

//     if (!process.env.STUDENT_EMAIL || !process.env.STUDENT_PASSWORD || !process.env.STUDENT_JWT_SECRET) {
//       return res.status(500).json({ message: "Student auth env not configured" });
//     }

//     if (email !== process.env.STUDENT_EMAIL.toLowerCase() || password !== process.env.STUDENT_PASSWORD) {
//       return res.status(401).json({ message: "Invalid student credentials" });
//     }

//     const name = String(process.env.STUDENT_NAME || "Student").trim();
//     const rollNo = String(process.env.STUDENT_ROLLNO || "RADHE001").trim();
//     const photoUrl = String(process.env.STUDENT_PHOTO_URL || "").trim();

//     await Student.findOneAndUpdate(
//       { email },
//       {
//         $setOnInsert: {
//           email,
//           name,
//           rollNo,
//           photoUrl,
//           foodTokens: 60,
//         },
//       },
//       { upsert: true, new: true }
//     );

//     const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
//     const token = signStudentToken({ role: "student", email, rollNo, exp }, process.env.STUDENT_JWT_SECRET);

//     return res.json({ token });
//   });

//   // ✅ health check (useful for deployment)
//   app.get("/health", (_req: Request, res: Response) => {
//     res.json({ ok: true });
//   });

//   // api routes
//   app.use("/api/attendance", attendanceRoutes);
//   app.use("/api/food", foodRoutes);
//   app.use("/api/student", studentRoutes);

//   // 404
//   app.use((_req, res) => {
//     res.status(404).json({ message: "Route not found" });
//   });

//   app.listen(PORT, () => {
//     console.log(`🚀 Server started on port ${PORT}`);
//     console.log("✅ Allowed CORS origins:", allowedOrigins);
//   });
// }

// start().catch((err) => {
//   console.error("❌ Server failed to start:", err);
//   process.exit(1);
// });

import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { signAdminToken } from "./middlewares/adminAuth";
import { signStudentToken } from "./middlewares/studentAuth";

import attendanceRoutes from "./routes/attendance.routes";
import foodRoutes from "./routes/food.routes";

import Student from "./models/Student";
import studentRoutes from "./routes/student.routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 7000;

function getAllowedOrigins() {
  const configured = String(process.env.CORS_ORIGINS || "")
    .split(",") 
    .map((x) => x.trim())
    .filter(Boolean);

  return configured.length ? configured : ["http://localhost:5173"];
}

async function start() {
  const mongo = process.env.MONGODB_CONNECTION_STRING;
  if (!mongo) {
    console.error(" Missing MONGODB_CONNECTION_STRING in .env");
    process.exit(1);
  }

  await mongoose.connect(mongo);
  console.log("Connected to DB");

  const app = express();

  // middlewares
  app.use(express.json());
  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients and same-origin requests with no Origin header.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );

  // Admin login
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_JWT_SECRET) {
      return res.status(500).json({ message: "Admin auth env not configured" });
    }

    if (email !== process.env.ADMIN_EMAIL.toLowerCase() || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
    const token = signAdminToken({ role: "admin", email, exp }, process.env.ADMIN_JWT_SECRET);

    return res.json({ token });
  });

  //  Student login (UPSERT student + include rollNo in token)
  app.post("/api/student/login", async (req: Request, res: Response) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "").trim();

    if (!process.env.STUDENT_EMAIL || !process.env.STUDENT_PASSWORD || !process.env.STUDENT_JWT_SECRET) {
      return res.status(500).json({ message: "Student auth env not configured" });
    }

    if (email !== process.env.STUDENT_EMAIL.toLowerCase() || password !== process.env.STUDENT_PASSWORD) {
      return res.status(401).json({ message: "Invalid student credentials" });
    }

    //  ensure student exists in DB (first time -> 60 tokens)
    const name = String(process.env.STUDENT_NAME || "Student").trim();
    const rollNo = String(process.env.STUDENT_ROLLNO || "RADHE001").trim();
    const photoUrl = String(process.env.STUDENT_PHOTO_URL || "").trim();

    await Student.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email,
          name,
          rollNo,
          photoUrl,
          foodTokens: 60,
        },
      },
      { upsert: true, new: true }
    );

    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
    const token = signStudentToken({ role: "student", email, rollNo, exp }, process.env.STUDENT_JWT_SECRET);

    return res.json({ token });
  });

  // health check
  app.get("/test", async (_req: Request, res: Response) => {
    res.json({ message: "Hello" });
  });

  // api routes
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/food", foodRoutes);
  app.use("/api/student", studentRoutes);

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
