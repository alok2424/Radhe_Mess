// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { setStudentToken } from "@/auth/studentSession";
// import { useToast } from "@/components/ToastProvider";

// export default function StudentLogin() {
//   const apiBase = import.meta.env.VITE_API_BASE_URL as string;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showToast } = useToast();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const from = (location.state as any)?.from || "/attendance";

//   const login = async (e?: React.FormEvent) => {
//     e?.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       showToast("Enter email and password", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${apiBase}/api/student/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });

//       const json = await res.json().catch(() => null);
//       if (!res.ok) throw new Error((json && json.message) || "Login failed");

//       setStudentToken(json.token);
//       showToast("Student login successful ✅", "success");
//       navigate(from, { replace: true });
//     } catch (err: any) {
//       showToast(err?.message || "Login failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Student Login</h1>
//         <p className="text-sm text-slate-600">Login using student credentials.</p>
//       </div>

//       <form onSubmit={login} className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-slate-700">Email</label>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="student@radhe.com"
//             className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-slate-700">Password</label>
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             type="password"
//             className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </section>
//   );
// }
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ToastProvider";
import { setStudentToken } from "@/auth/studentSession";

export default function StudentLogin() {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string;
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from || "/student/profile";

  const login = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Enter email and password", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${apiBase}/api/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error((json && json.message) || "Login failed");

      setStudentToken(json.token);
      showToast("Student login successful ✅", "success");
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Login</h1>
        <p className="text-sm text-slate-600">Login to view profile and mark attendance.</p>
      </div>

      <form onSubmit={login} className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
