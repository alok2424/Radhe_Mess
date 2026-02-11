import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { apiGet, apiPut } from "@/api/http";
import { getAdminToken } from "@/auth/adminSession";
import { useNavigate } from "react-router-dom";

type FoodItem = { name: string; imageUrl?: string };
type TodayFoodResponse = { dateKey: string; items: FoodItem[]; source: string };

export default function UpdateTodayFood() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const token = getAdminToken();

  const [items, setItems] = useState<FoodItem[]>(
    Array.from({ length: 5 }).map(() => ({ name: "", imageUrl: "" }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast("Admin not logged in", "error");
      navigate("/login/admin", { replace: true, state: { from: "/admin/menu" } });
      return;
    }

    (async () => {
      try {
        const data = await apiGet<TodayFoodResponse>("/api/food/today");
        if (Array.isArray(data.items) && data.items.length === 5) setItems(data.items);
      } catch {
        // ignore
      }
    })();
  }, [token, navigate, showToast]);

  const updateItem = (idx: number, patch: Partial<FoodItem>) => {
    setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  };

  const save = async () => {
    if (!token) {
      showToast("Admin not logged in", "error");
      navigate("/login/admin", { replace: true, state: { from: "/admin/menu" } });
      return;
    }

    for (const it of items) {
      if (!String(it.name || "").trim()) {
        showToast("All 5 food names are required", "error");
        return;
      }
    }

    try {
      setLoading(true);

      await apiPut(
        "/api/food/today",
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Menu updated ✅", "success");
    } catch (e: any) {
      showToast(e?.message || "Failed to update menu", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Update Today’s Menu</h1>
        <p className="text-sm text-slate-600">Admin only.</p>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold mb-2">Item {idx + 1}</div>

            <input
              value={it.name}
              onChange={(e) => updateItem(idx, { name: e.target.value })}
              placeholder="Food name"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />

            <input
              value={it.imageUrl || ""}
              onChange={(e) => updateItem(idx, { imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Today’s Menu"}
      </button>
    </section>
  );
}

