import { Link, useNavigate } from "react-router-dom";
import { clearAdminToken } from "@/auth/adminSession";
import { useToast } from "@/components/ToastProvider";

export default function AdminHome() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const logout = () => {
    clearAdminToken();
    showToast("Logged out", "success");
    navigate("/", { replace: true });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-slate-600">
            Manage today’s menu and view attendance analytics.
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/menu"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Update Menu
        </Link>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Dashboard
        </Link>

        {/* ✅ NEW: Student List */}
        <Link
          to="/admin/student-list"
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Student List
        </Link>
      </div>
    </section>
  );
}
