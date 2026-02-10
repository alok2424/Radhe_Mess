import { useState } from "react";
import { apiPost } from "@/api/http";

type MarkAttendanceResponse = {
  message: string;
  attendance?: {
    id: string;
    rollNo: string;
    dateKey: string;
    markedAt: string;
  };
};

export default function Attendance() {
  const [rollNo, setRollNo] = useState("");
  const [status, setStatus] = useState<"idle" | "marking" | "success" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string>("");

  const markAttendance = async () => {
    const r = rollNo.trim();
    if (!r) {
      setStatus("error");
      setMsg("Please enter your Roll No.");
      return;
    }

    try {
      setStatus("marking");
      setMsg("");

      const data = await apiPost<MarkAttendanceResponse>("/api/attendance/mark", {
        rollNo: r,
      });

      setStatus("success");
      setMsg(data.message || "Attendance marked");
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message || "Failed to mark attendance");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mark Your Attendance</h1>
        <p className="text-sm text-slate-600">
          Enter your Roll No and tap the button.
        </p>
      </div>

      <div className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
        <label className="block text-sm font-medium text-slate-700">
          Roll No
        </label>
        <input
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="e.g. RADHE001"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />

        <button
          onClick={markAttendance}
          disabled={status === "marking"}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "marking" ? "Marking..." : "Mark Attendance"}
        </button>
      </div>

      {msg && status === "success" && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {msg} ✅
        </div>
      )}

      {msg && status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {msg}
        </div>
      )}
    </section>
  );
}
