import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/api/http";
import { useToast } from "@/components/ToastProvider";
import { getAdminToken } from "@/auth/adminSession";
import { useNavigate } from "react-router-dom";

type StudentRow = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  photoUrl?: string;
  foodTokens: number;
  createdAt?: string;
};

type ListResponse = {
  total: number;
  students: StudentRow[];
};

export default function StudentList() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const token = getAdminToken();

  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [resettingId, setResettingId] = useState<string | null>(null);

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const load = async (roll?: string) => {
    if (!token) {
      showToast("Admin not logged in", "error");
      navigate("/login/admin", { replace: true, state: { from: "/admin/student-list" } });
      return;
    }

    try {
      setLoading(true);
      const qs = roll ? `?rollNo=${encodeURIComponent(roll)}` : "";
      const data = await apiGet<ListResponse>(`/api/student/admin/list${qs}`, {
        headers: authHeaders,
      });
      setStudents(data.students || []);
    } catch (e: any) {
      setStudents([]);
      showToast(e?.message || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await load(rollNo.trim());
  };

  const onReset = async (studentId: string) => {
    if (!token) return;

    try {
      setResettingId(studentId);

      await apiPost(
        "/api/student/admin/reset-tokens",
        { studentId },
        { headers: authHeaders }
      );

      showToast("Tokens reset to 60 ✅", "success");

      // update UI
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, foodTokens: 60 } : s))
      );
    } catch (e: any) {
      showToast(e?.message || "Failed to reset tokens", "error");
    } finally {
      setResettingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student List</h1>
        <p className="text-sm text-slate-600">
          View all students who have logged in and manage their tokens.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={onSearch} className="rounded-md border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700">
              Search by Roll No
            </label>
            <input
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. RADHE001"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setRollNo("");
              load("");
            }}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Total: <span className="font-semibold text-slate-900">{students.length}</span>
        </div>

        <button
          onClick={() => load(rollNo.trim())}
          disabled={loading}
          className="text-sm font-medium text-slate-900 underline underline-offset-4 disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          Loading students...
        </div>
      )}

      {!loading && students.length === 0 && (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          No students found.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((s) => (
          <div key={s.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                {s.photoUrl ? (
                  <img src={s.photoUrl} alt={s.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-600">
                    {String(s.name || "S").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                <div className="truncate text-xs text-slate-600">{s.email}</div>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Roll No</span>
                <span className="font-semibold text-slate-900">{s.rollNo}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Food Tokens</span>
                <span className="font-semibold text-slate-900">{s.foodTokens}</span>
              </div>
            </div>

            <button
              onClick={() => onReset(s.id)}
              disabled={resettingId === s.id}
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {resettingId === s.id ? "Resetting..." : "RESET TOKENS (60)"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
