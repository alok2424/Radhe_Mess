import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

function base64url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

export function signStudentToken(payload: object, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = base64url(JSON.stringify(header));
  const payloadPart = base64url(JSON.stringify(payload));
  const data = `${headerPart}.${payloadPart}`;

  const sig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${data}.${sig}`;
}

function verifyStudentToken(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerPart, payloadPart, sig] = parts;
  const data = `${headerPart}.${payloadPart}`;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (expected !== sig) return null;

  const payloadJson = base64urlDecode(payloadPart);
  const payload = JSON.parse(payloadJson);

  if (payload?.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

export function requireStudent(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.STUDENT_JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "STUDENT_JWT_SECRET not configured" });

  const auth = String(req.header("authorization") || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const payload = verifyStudentToken(token, secret);
  if (!payload || payload.role !== "student") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).student = payload;
  next();
}
