
// import { useEffect, useMemo, useState } from "react";
// import FoodCard from "@/components/FoodCard";
// import { apiGet } from "@/api/http";

// type FoodItem = { name: string; imageUrl: string };
// type FoodTodayResponse = { dateKey: string; items: FoodItem[]; source: "db" | "default" };

// function getISTMinutesNow() {
//   const now = new Date();
//   const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
//   return ist.getUTCHours() * 60 + ist.getUTCMinutes();
// }

// function getFoodSlot() {
//   const mins = getISTMinutesNow();
//   const LUNCH_START = 11 * 60 + 30; // 11:30
//   const LUNCH_END = 15 * 60; // 15:00
//   const DINNER_START = 18 * 60; // 18:00
//   const DINNER_END = 22 * 60; // 22:00

//   if (mins >= LUNCH_START && mins < LUNCH_END) return { mode: "SHOW" as const, title: "Today’s LUNCH" };
//   if (mins >= DINNER_START && mins < DINNER_END) return { mode: "SHOW" as const, title: "Today’s DINNER" };

//   if (mins < LUNCH_START) return { mode: "HIDE" as const, message: "Your LUNCH will be listed at 11:30am" };
//   if (mins >= LUNCH_END && mins < DINNER_START) return { mode: "HIDE" as const, message: "Your DINNER will be listed at 6:00pm" };
//   return { mode: "HIDE" as const, message: "Menu is closed for today. Next LUNCH will be listed at 11:30am" };
// }

// export default function TodayFood() {
//   const [items, setItems] = useState<FoodItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [nowTick, setNowTick] = useState(0);

//   const slot = useMemo(() => getFoodSlot(), [nowTick]);

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

//   // tick every minute to update visibility
//   useEffect(() => {
//     const t = window.setInterval(() => setNowTick((v) => v + 1), 60_000);
//     return () => window.clearInterval(t);
//   }, []);

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Today’s Food</h1>
//         <p className="text-sm text-slate-600">RADHE MESS & CAFE menu.</p>
//       </div>

//       {slot.mode === "HIDE" ? (
//         <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
//           {slot.message}
//         </div>
//       ) : (
//         <>
//           <div className="text-lg font-semibold">{slot.title}</div>

//           {loading ? (
//             <div className="text-sm text-slate-600">Loading menu...</div>
//           ) : items.length === 0 ? (
//             <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
//               No menu found for today.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {items.map((item) => (
//                 <FoodCard key={item.name} name={item.name} imageUrl={item.imageUrl} />
//               ))}
//             </div>
//           )}
//         </>
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

  useEffect(() => {
    const t = window.setInterval(() => setNowTick((v) => v + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="space-y-4">
      {/* ORANGE SHADED HERO (like reference image) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-orange-100/60 px-6 py-6 backdrop-blur-xl shadow-[0_30px_80px_-52px_rgba(15,23,42,0.7),0_26px_70px_-52px_rgba(249,115,22,0.55)]">
        {/* soft orange glow like Image */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,153,0,0.38),transparent_62%)] blur-3xl" />
          <div className="absolute -right-28 -bottom-36 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,220,170,0.55),transparent_62%)] blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85),transparent_62%)] blur-3xl" />
          {/* subtle sparkle layer */}
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.7),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.55),transparent_42%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.45),transparent_45%)]" />
        </div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Today’s Food
          </h1>
          <p className="mt-1 text-sm text-slate-700">RADHE MESS & CAFE menu.</p>
        </div>
      </div>

      {slot.mode === "HIDE" ? (
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/75 via-amber-50/65 to-orange-100/55 p-5 text-sm text-slate-800 backdrop-blur-xl shadow-[0_26px_70px_-50px_rgba(15,23,42,0.65),0_22px_56px_-46px_rgba(249,115,22,0.5)]">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,153,0,0.28),transparent_62%)] blur-3xl" />
            <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85),transparent_62%)] blur-3xl" />
          </div>
          <div className="relative">{slot.message}</div>
        </div>
      ) : (
        <>
          <div className="inline-flex w-fit items-center gap-2 rounded-3xl border border-white/60 bg-gradient-to-r from-orange-50/70 via-amber-50/70 to-orange-100/55 px-4 py-2 text-lg font-semibold text-slate-900 backdrop-blur-xl shadow-[0_22px_60px_-44px_rgba(15,23,42,0.55),0_18px_44px_-36px_rgba(249,115,22,0.45)]">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
            {slot.title}
          </div>

          {loading ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/70 via-amber-50/60 to-orange-100/50 p-5 text-sm text-slate-800 backdrop-blur-xl shadow-[0_22px_56px_-44px_rgba(15,23,42,0.6),0_18px_44px_-38px_rgba(249,115,22,0.45)]">
              Loading menu...
            </div>
          ) : items.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/75 via-amber-50/65 to-orange-100/55 p-5 text-sm text-slate-800 backdrop-blur-xl shadow-[0_26px_70px_-50px_rgba(15,23,42,0.65),0_22px_56px_-46px_rgba(249,115,22,0.5)]">
              No menu found for today.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/60 via-amber-50/55 to-white/45 backdrop-blur-xl shadow-[0_22px_56px_-44px_rgba(15,23,42,0.55),0_18px_44px_-36px_rgba(249,115,22,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_86px_-56px_rgba(15,23,42,0.65),0_26px_66px_-50px_rgba(249,115,22,0.55)]"
                >
                  <FoodCard name={item.name} imageUrl={item.imageUrl} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}