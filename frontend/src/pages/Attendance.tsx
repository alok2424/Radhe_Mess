// import { useState } from "react";
// import { apiPost } from "@/api/http";

// type MarkAttendanceResponse = {
//   message: string;
//   attendance?: {
//     id: string;
//     rollNo: string;
//     dateKey: string;
//     markedAt: string;
//   };
// };

// export default function Attendance() {
//   const [rollNo, setRollNo] = useState("");
//   const [status, setStatus] = useState<"idle" | "marking" | "success" | "error">(
//     "idle"
//   );
//   const [msg, setMsg] = useState<string>("");

//   const markAttendance = async () => {
//     const r = rollNo.trim();
//     if (!r) {
//       setStatus("error");
//       setMsg("Please enter your Roll No.");
//       return;
//     }

//     try {
//       setStatus("marking");
//       setMsg("");

//       const data = await apiPost<MarkAttendanceResponse>("/api/attendance/mark", {
//         rollNo: r,
//       });

//       setStatus("success");
//       setMsg(data.message || "Attendance marked");
//     } catch (e: any) {
//       setStatus("error");
//       setMsg(e?.message || "Failed to mark attendance");
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Mark Your Attendance</h1>
//         <p className="text-sm text-slate-600">
//           Enter your Roll No and tap the button.
//         </p>
//       </div>

//       <div className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <label className="block text-sm font-medium text-slate-700">
//           Roll No
//         </label>
//         <input
//           value={rollNo}
//           onChange={(e) => setRollNo(e.target.value)}
//           placeholder="e.g. RADHE001"
//           className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//         />

//         <button
//           onClick={markAttendance}
//           disabled={status === "marking"}
//           className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//         >
//           {status === "marking" ? "Marking..." : "Mark Attendance"}
//         </button>
//       </div>

//       {msg && status === "success" && (
//         <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
//           {msg} ✅
//         </div>
//       )}

//       {msg && status === "error" && (
//         <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
//           {msg}
//         </div>
//       )}
//     </section>
//   );
// }

// import { useState } from "react";
// import { apiPost } from "@/api/http";
// import { useToast } from "@/components/ToastProvider";
// import { useAuth0 } from "@auth0/auth0-react";

// type MarkAttendanceResponse = {
//   message: string;
//   attendance?: {
//     id: string;
//     rollNo: string;
//     dateKey: string;
//     markedAt: string;
//   };
// };

// export default function Attendance() {
//   const { isAuthenticated, user, loginWithRedirect } = useAuth0();
//   const { showToast } = useToast();

//   const [rollNo, setRollNo] = useState("");
//   const [status, setStatus] = useState<"idle" | "marking" | "success" | "error">(
//     "idle"
//   );
//   const [msg, setMsg] = useState<string>("");

//   const markAttendance = async () => {
//     // ✅ Block marking if not logged in
//     if (!isAuthenticated) {
//       showToast("You are not logged in", "error");
//       return;
//     }

//     const r = rollNo.trim();
//     if (!r) {
//       setStatus("error");
//       setMsg("Please enter your Roll No.");
//       return;
//     }

//     try {
//       setStatus("marking");
//       setMsg("");

//       const data = await apiPost<MarkAttendanceResponse>("/api/attendance/mark", {
//         rollNo: r,
//       });

//       setStatus("success");
//       setMsg(data.message || "Attendance marked");
//       showToast("Attendance marked ✅", "success");
//     } catch (e: any) {
//       setStatus("error");
//       const m = e?.message || "Failed to mark attendance";
//       setMsg(m);
//       showToast(m, "error");
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Mark Your Attendance</h1>
//         <p className="text-sm text-slate-600">
//           You must be logged in to mark attendance.
//         </p>
//       </div>

//       {!isAuthenticated && (
//         <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
//           <div className="font-medium">Not logged in</div>
//           <div className="mt-1 text-slate-600">
//             Please login first, then mark your attendance.
//           </div>
//           <button
//             onClick={() => loginWithRedirect()}
//             className="mt-3 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//           >
//             Login
//           </button>
//         </div>
//       )}

//       <div className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <label className="block text-sm font-medium text-slate-700">Roll No</label>
//         <input
//           value={rollNo}
//           onChange={(e) => setRollNo(e.target.value)}
//           placeholder="e.g. RADHE001"
//           className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//         />

//         <button
//           onClick={markAttendance}
//           disabled={status === "marking"}
//           className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//         >
//           {status === "marking" ? "Marking..." : "Mark Attendance"}
//         </button>

//         {isAuthenticated && (
//           <div className="text-xs text-slate-500">
//             Logged in as: {user?.name || user?.email || "Student"}
//           </div>
//         )}
//       </div>

//       {msg && status === "success" && (
//         <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
//           {msg} ✅
//         </div>
//       )}

//       {msg && status === "error" && (
//         <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
//           {msg}
//         </div>
//       )}
//     </section>
//   );
// }
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiPost } from "@/api/http";
// import { useToast } from "@/components/ToastProvider";
// import { getStudentToken } from "@/auth/studentSession";

// type MarkAttendanceResponse = {
//   message: string;
//   attendance?: {
//     id: string;
//     rollNo: string;
//     dateKey: string;
//     mealType?: "LUNCH" | "DINNER";
//     markedAt: string;
//   };
// };

// export default function Attendance() {
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   const [rollNo, setRollNo] = useState("");
//   const [status, setStatus] = useState<"idle" | "marking" | "success" | "error">("idle");
//   const [msg, setMsg] = useState<string>("");

//   const markAttendance = async () => {
//     const token = getStudentToken();

//     // ✅ Block if not logged in
//     if (!token) {
//       showToast("You are not logged in", "error");
//       navigate("/login/student", { replace: true, state: { from: "/attendance" } });
//       return;
//     }

//     const r = rollNo.trim();
//     if (!r) {
//       setStatus("error");
//       setMsg("Please enter your Roll No.");
//       showToast("Please enter your Roll No.", "error");
//       return;
//     }

//     try {
//       setStatus("marking");
//       setMsg("");

//       const data = await apiPost<MarkAttendanceResponse>(
//         "/api/attendance/mark",
//         { rollNo: r },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setStatus("success");
//       setMsg(data.message || "Attendance marked");
//       showToast(data.message || "Attendance marked ✅", "success");
//     } catch (e: any) {
//       setStatus("error");
//       const m = e?.message || "Failed to mark attendance";
//       setMsg(m);
//       showToast(m, "error");
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Mark Your Attendance</h1>
//         <p className="text-sm text-slate-600">You must be logged in as a student.</p>
//       </div>

//       <div className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <label className="block text-sm font-medium text-slate-700">Roll No</label>
//         <input
//           value={rollNo}
//           onChange={(e) => setRollNo(e.target.value)}
//           placeholder="e.g. RADHE001"
//           className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//         />

//         <button
//           onClick={markAttendance}
//           disabled={status === "marking"}
//           className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//         >
//           {status === "marking" ? "Marking..." : "Mark Attendance"}
//         </button>
//       </div>

//       {msg && status === "success" && (
//         <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
//           {msg} ✅
//         </div>
//       )}

//       {msg && status === "error" && (
//         <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
//           {msg}
//         </div>
//       )}
//     </section>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/api/http";
import { useToast } from "@/components/ToastProvider";
import { getStudentToken } from "@/auth/studentSession";
import { useNavigate } from "react-router-dom";

type FoodItem = { name: string; imageUrl?: string };
type TodayFoodResponse = { dateKey: string; items: FoodItem[]; source: string };

type MarkAttendanceResponse = {
  message: string;
  tokensLeft?: number;
  attendance?: {
    id: string;
    rollNo: string;
    dateKey: string;
    mealType: "LUNCH" | "DINNER";
    markedAt: string;
    selectedFoods: string[];
  };
};

export default function Attendance() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const token = getStudentToken();
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const [menu, setMenu] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<"idle" | "marking">("idle");

  useEffect(() => {
    if (!token) {
      showToast("Please login as student first", "error");
      navigate("/login/student", { replace: true, state: { from: "/attendance" } });
      return;
    }

    (async () => {
      try {
        const data = await apiGet<TodayFoodResponse>("/api/food/today");
        const names = (data.items || []).map((x) => String(x?.name || "").trim()).filter(Boolean);
        setMenu(names);
      } catch (e: any) {
        setMenu([]);
        showToast(e?.message || "Failed to load today's menu", "error");
      }
    })();
  }, [token, navigate, showToast]);

  const toggleFood = (name: string) => {
    setSelected((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === name.toLowerCase());
      if (exists) return prev.filter((x) => x.toLowerCase() !== name.toLowerCase());
      if (prev.length >= 3) {
        showToast("You can select maximum 3 items", "error");
        return prev;
      }
      return [...prev, name];
    });
  };

  const markAttendance = async () => {
    if (!token) {
      showToast("Please login as student first", "error");
      navigate("/login/student", { replace: true, state: { from: "/attendance" } });
      return;
    }

    if (selected.length < 1) {
      showToast("Select at least 1 food item", "error");
      return;
    }

    try {
      setStatus("marking");

      const data = await apiPost<MarkAttendanceResponse>(
        "/api/attendance/mark",
        { selectedFoods: selected },
        { headers: authHeaders }
      );

      showToast(`${data.message} ✅ Tokens left: ${data.tokensLeft ?? "?"}`, "success");
      setSelected([]);
      setOpen(false);
    } catch (e: any) {
      showToast(e?.message || "Failed to mark attendance", "error");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mark Your Attendance</h1>
        <p className="text-sm text-slate-600">
          Select up to 3 food items (minimum 1), then mark attendance.
        </p>
      </div>

      <div className="max-w-2xl rounded-md border border-slate-200 bg-white p-4">
        {/* Multi-select */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700">
            Select Food (max 3)
          </label>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            <span className={selected.length ? "text-slate-900" : "text-slate-500"}>
              {selected.length ? selected.join(", ") : "Click to choose food items"}
            </span>
            <span className="text-slate-500">{open ? "▲" : "▼"}</span>
          </button>

          {open && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
              {menu.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-600">
                  Menu not available
                </div>
              ) : (
                menu.map((name) => {
                  const checked = selected.some((x) => x.toLowerCase() === name.toLowerCase());
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleFood(name)}
                      className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      <span className="truncate">{name}</span>
                      <span className="text-slate-600">{checked ? "✅" : ""}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}

          <div className="mt-2 text-xs text-slate-500">
            Selected: <span className="font-semibold text-slate-900">{selected.length}</span>/3
          </div>
        </div>

        <button
          onClick={markAttendance}
          disabled={status === "marking" || selected.length < 1}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "marking" ? "Marking..." : "Mark Attendance"}
        </button>
      </div>
    </section>
  );
}
