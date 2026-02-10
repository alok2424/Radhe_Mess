// import { useEffect, useState } from "react";
// import FoodCard from "@/components/FoodCard";
// import { apiGet } from "@/api/http";

// type FoodItem = {
//   name: string;
//   imageUrl: string;
// };

// type FoodTodayResponse = {
//   dateKey: string;
//   items: FoodItem[];
//   source: "db" | "default";
// };

// export default function TodayFood() {
//   const [items, setItems] = useState<FoodItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       try {
//         setLoading(true);
//         const data = await apiGet<FoodTodayResponse>("/api/food/today");
//         if (!cancelled) setItems(data.items);
//       } catch {
//         if (!cancelled) setItems([]);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Food</h1>
//         <p className="text-sm text-slate-600">
//           Fresh menu for RADHE MESS & CAFE.
//         </p>
//       </div>

//       {loading ? (
//         <div className="text-sm text-slate-600">Loading menu...</div>
//       ) : items.length === 0 ? (
//         <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
//           No menu found for today.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {items.map((item) => (
//             <FoodCard key={item.name} name={item.name} imageUrl={item.imageUrl} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import FoodCard from "@/components/FoodCard";
import { apiGet } from "@/api/http";

type FoodItem = { name: string; imageUrl: string };
type FoodTodayResponse = { dateKey: string; items: FoodItem[]; source: "db" | "default" };

function getISTMinutesNow() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}

function getFoodSlot() {
  const mins = getISTMinutesNow();
  const LUNCH_START = 11 * 60 + 30; // 11:30
  const LUNCH_END = 15 * 60; // 15:00
  const DINNER_START = 18 * 60; // 18:00
  const DINNER_END = 22 * 60; // 22:00

  if (mins >= LUNCH_START && mins < LUNCH_END) return { mode: "SHOW" as const, title: "Today’s LUNCH" };
  if (mins >= DINNER_START && mins < DINNER_END) return { mode: "SHOW" as const, title: "Today’s DINNER" };

  if (mins < LUNCH_START) return { mode: "HIDE" as const, message: "Your LUNCH will be listed at 11:30am" };
  if (mins >= LUNCH_END && mins < DINNER_START) return { mode: "HIDE" as const, message: "Your DINNER will be listed at 6:00pm" };
  return { mode: "HIDE" as const, message: "Menu is closed for today. Next LUNCH will be listed at 11:30am" };
}

export default function TodayFood() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nowTick, setNowTick] = useState(0);

  const slot = useMemo(() => getFoodSlot(), [nowTick]);

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

  // tick every minute to update visibility
  useEffect(() => {
    const t = window.setInterval(() => setNowTick((v) => v + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Today’s Food</h1>
        <p className="text-sm text-slate-600">RADHE MESS & CAFE menu.</p>
      </div>

      {slot.mode === "HIDE" ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {slot.message}
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold">{slot.title}</div>

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
        </>
      )}
    </section>
  );
}
