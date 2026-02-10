import { useEffect, useState } from "react";
import FoodCard from "@/components/FoodCard";
import { apiGet } from "@/api/http";

type FoodItem = {
  name: string;
  imageUrl: string;
};

type FoodTodayResponse = {
  dateKey: string;
  items: FoodItem[];
  source: "db" | "default";
};

export default function TodayFood() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await apiGet<FoodTodayResponse>("/api/food/today");
        if (!cancelled) setItems(data.items);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Food</h1>
        <p className="text-sm text-slate-600">
          Fresh menu for RADHE MESS & CAFE.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-slate-600">Loading menu...</div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          No menu found for today.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoodCard key={item.name} name={item.name} imageUrl={item.imageUrl} />
          ))}
        </div>
      )}
    </section>
  );
}
