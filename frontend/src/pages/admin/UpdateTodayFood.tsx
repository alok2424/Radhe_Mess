import { useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";

type FoodItem = { name: string; imageUrl: string };

const emptyItems: FoodItem[] = Array.from({ length: 5 }).map(() => ({
  name: "",
  imageUrl: "",
}));

export default function UpdateTodayFood() {
  const { showToast } = useToast();

  const [adminKey, setAdminKey] = useState("");
  const [items, setItems] = useState<FoodItem[]>(emptyItems);
  const [saving, setSaving] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL as string;

//   const isValid = useMemo(() => {
//     return (
//       adminKey.trim().length > 0 &&
//       items.length === 5 &&
//       items.every((i) => i.name.trim().length >= 2 && i.imageUrl.trim().length > 0)
//     );
//   }, [adminKey, items]);
const isValid = useMemo(() => {
  return (
    adminKey.trim().length > 0 &&
    items.length === 5 &&
    items.every((i) => i.name.trim().length >= 2)
  );
}, [adminKey, items]);

  const updateItem = (idx: number, key: keyof FoodItem, value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  const save = async () => {
    if (!isValid) {
      showToast("Fill admin key + all 5 items (name + imageUrl).", "error");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${apiBase}/api/food/today`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ items }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error((data && data.message) || "Failed to update menu");
      }

      showToast("Today's menu updated ✅", "success");
    } catch (e: any) {
      showToast(e?.message || "Failed to update menu", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin: Update Today’s Food</h1>
        <p className="text-sm text-slate-600">
          Update exactly 5 items for today’s menu.
        </p>
      </div>

      <div className="max-w-xl space-y-3 rounded-md border border-slate-200 bg-white p-4">
        <label className="block text-sm font-medium text-slate-700">
          Admin Key
        </label>
        <input
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Enter ADMIN_API_KEY"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />

        <div className="pt-2 text-sm font-semibold">Today’s 5 Items</div>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-md border border-slate-200 p-3">
              <div className="text-sm font-medium mb-2">Item {idx + 1}</div>

              <div className="grid gap-2">
                <input
                  value={it.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  placeholder="Food name"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <input
                  value={it.imageUrl}
                  onChange={(e) => updateItem(idx, "imageUrl", e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Today’s Menu"}
        </button>
      </div>
    </section>
  );
}
