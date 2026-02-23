// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { setAdminToken } from "@/auth/adminSession";
// import { useToast } from "@/components/ToastProvider";

// export default function AdminLogin() {
//   const apiBase = import.meta.env.VITE_API_BASE_URL as string;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showToast } = useToast();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const from = (location.state as any)?.from || "/admin";

//   const login = async (e?: React.FormEvent) => {
//     e?.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       showToast("Enter email and password", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${apiBase}/api/admin/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });

//       const json = await res.json().catch(() => null);
//       if (!res.ok) throw new Error((json && json.message) || "Login failed");

//       setAdminToken(json.token);
//       showToast("Admin login successful ✅", "success");
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
//         <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
//         <p className="text-sm text-slate-600">
//           Login using admin credentials (from backend .env).
//         </p>
//       </div>

//       <form onSubmit={login} className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-slate-700">Email</label>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@radhe.com"
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
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAdminToken } from "@/auth/adminSession";
import { useToast } from "@/components/ToastProvider";

export default function AdminLogin() {
  const apiBase =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.DEV ? "http://localhost:7000" : "");

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from || "/admin";

  const login = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      showToast("Enter email and password", "error");
      return;
    }

    if (!apiBase) {
      showToast("API base URL not configured (VITE_API_BASE_URL).", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed, password: passwordTrimmed }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error((json && json.message) || `Login failed (${res.status})`);

      if (!json?.token) {
        throw new Error("Login succeeded but token missing in response");
      }

      setAdminToken(json.token);
      showToast("Admin login successful ✅", "success");
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
        <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
        <p className="text-sm text-slate-600">
          Login using admin credentials (from backend .env).
        </p>
      </div>

      <form
        onSubmit={login}
        className="max-w-md space-y-3 rounded-md border border-slate-200 bg-white p-4"
      >
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@radhe.com"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Optional debug (remove later) */}
        {import.meta.env.DEV && (
          <p className="text-xs text-slate-500 break-all">API: {apiBase}</p>
        )}
      </form>
    </section>
  );
}