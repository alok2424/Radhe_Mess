import { useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { getAdminToken } from "@/auth/adminSession";

type DayRow = {
  dateKey: string;
  lunchCount: number;
  dinnerCount: number;
  total: number;
};

type AnalyticsResponse = {
  from: string;
  to: string;
  days: DayRow[];
};

type TopFoodRow = {
  foodName: string;
  count: number;
};

type TopFoodResponse = {
  month: string; // YYYY-MM
  from: string;  // YYYY-MM-DD
  to: string;    // YYYY-MM-DD
  top3: TopFoodRow[];
};

function todayKeyIST() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function currentMonthIST() {
  return todayKeyIST().slice(0, 7); // YYYY-MM
}

function defaultFromKeyIST() {
  const to = todayKeyIST();
  const d = new Date(`${to}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 13);
  return d.toISOString().slice(0, 10);
}

function titleCase(s: string) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DashboardAnalytics() {
  const { showToast } = useToast();
  const apiBase = import.meta.env.VITE_API_BASE_URL as string;

  // Daily chart controls
  const [from, setFrom] = useState(defaultFromKeyIST());
  const [to, setTo] = useState(todayKeyIST());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  // Top foods controls
  const [month, setMonth] = useState(currentMonthIST()); // YYYY-MM
  const [topLoading, setTopLoading] = useState(false);
  const [top, setTop] = useState<TopFoodResponse | null>(null);

  const maxValue = useMemo(() => {
    if (!data?.days?.length) return 1;
    return Math.max(1, ...data.days.map((d) => Math.max(d.lunchCount, d.dinnerCount)));
  }, [data]);

  const fetchAnalytics = async () => {
    const token = getAdminToken();
    if (!token) {
      showToast("Admin not logged in", "error");
      return;
    }

    try {
      setLoading(true);

      const qs = new URLSearchParams({ from, to }).toString();
      const res = await fetch(`${apiBase}/api/attendance/analytics/daily?${qs}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error((json && json.message) || "Failed to load analytics");

      setData(json as AnalyticsResponse);
      showToast("Analytics loaded ✅", "success");
    } catch (e: any) {
      setData(null);
      showToast(e?.message || "Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopFoods = async () => {
    const token = getAdminToken();
    if (!token) {
      showToast("Admin not logged in", "error");
      return;
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      showToast("Month must be in YYYY-MM format", "error");
      return;
    }

    try {
      setTopLoading(true);

      const qs = new URLSearchParams({ month }).toString();
      const res = await fetch(`${apiBase}/api/attendance/analytics/top-food?${qs}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error((json && json.message) || "Failed to load top foods");

      setTop(json as TopFoodResponse);
      showToast("Top foods loaded ✅", "success");
    } catch (e: any) {
      setTop(null);
      showToast(e?.message || "Failed to load top foods", "error");
    } finally {
      setTopLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Daily attendance counts (Lunch + Dinner) + monthly food popularity.</p>
      </div>

      {/* ✅ TOP 3 MOST LIKED FOODS (Monthly) */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Monthly Top 3 Most Liked Foods</div>
            <div className="text-xs text-slate-600">
              Based on student selections while marking attendance.
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700">Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <button
              onClick={fetchTopFoods}
              disabled={topLoading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {topLoading ? "Loading..." : "Load Top Foods"}
            </button>
          </div>
        </div>

        {top && (
          <div className="mt-4">
            <div className="text-xs text-slate-600">
              Range: <span className="font-semibold text-slate-900">{top.from}</span> →{" "}
              <span className="font-semibold text-slate-900">{top.to}</span>
            </div>

            {(!top.top3 || top.top3.length === 0) ? (
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                No food selection data found for this month.
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {top.top3.map((x, idx) => (
                  <div key={x.foodName} className="rounded-md border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-600">#{idx + 1}</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{titleCase(x.foodName)}</div>
                    <div className="mt-2 text-sm text-slate-700">
                      Total students selected:{" "}
                      <span className="font-semibold text-slate-900">{x.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls (Daily chart) */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {data && (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold">
            Range: {data.from} → {data.to}
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="mb-2 grid grid-cols-[140px_1fr] text-xs text-slate-600">
                <div>Legend</div>
                <div className="flex gap-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-slate-900" /> Lunch
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-slate-400" /> Dinner
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] gap-4">
                <div className="text-xs text-slate-600">
                  Max/day: <span className="font-semibold text-slate-900">{maxValue}</span>
                </div>

                <div className="flex items-end gap-2 border-l border-b border-slate-200 pl-2 pb-2">
                  {data.days.map((d) => {
                    const lunchH = Math.round((d.lunchCount / maxValue) * 140);
                    const dinnerH = Math.round((d.dinnerCount / maxValue) * 140);

                    return (
                      <div key={d.dateKey} className="flex flex-col items-center gap-2">
                        <div
                          className="flex items-end gap-1"
                          title={`${d.dateKey} | L:${d.lunchCount} D:${d.dinnerCount}`}
                        >
                          <div className="w-3 rounded-t bg-slate-900" style={{ height: `${lunchH}px` }} />
                          <div className="w-3 rounded-t bg-slate-400" style={{ height: `${dinnerH}px` }} />
                        </div>
                        <div className="w-10 truncate text-[10px] text-slate-600">
                          {d.dateKey.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {data && (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold">Daily Breakdown</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Lunch</th>
                  <th className="py-2 pr-4">Dinner</th>
                  <th className="py-2 pr-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.days.map((d) => (
                  <tr key={d.dateKey} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{d.dateKey}</td>
                    <td className="py-2 pr-4">{d.lunchCount}</td>
                    <td className="py-2 pr-4">{d.dinnerCount}</td>
                    <td className="py-2 pr-4 font-semibold">{d.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
