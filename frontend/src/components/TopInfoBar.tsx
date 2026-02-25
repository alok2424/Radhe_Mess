// import { useEffect, useMemo, useState } from "react";
// import { apiGet } from "@/api/http";

// type TodayCountResponse = {
//   dateKey: string;
//   presentCount: number;
// };

// function formatNow(now: Date) {
//   const dayName = now.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase();
//   const dateStr = now
//     .toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     })
//     .replace(/,/g, "")
//     .toUpperCase();

//   const time = now
//     .toLocaleTimeString("en-IN", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     })
//     .replace(" ", "")
//     .toLowerCase();

//   return `DAY: ${dayName}, ${dateStr} , TIME: ${time}`;
// }

// export default function TopInfoBar() {
//   const [now, setNow] = useState(() => new Date());
//   const [presentCount, setPresentCount] = useState<number>(0);

//   const label = useMemo(() => formatNow(now), [now]);

//   useEffect(() => {
//     const id = window.setInterval(() => setNow(new Date()), 1000);
//     return () => window.clearInterval(id);
//   }, []);

//   // fetch count on load + every 10 seconds
//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       try {
//         const data = await apiGet<TodayCountResponse>("/api/attendance/today-count");
//         if (!cancelled) setPresentCount(data.presentCount);
//       } catch (e) {
//         // keep UI stable even if backend is down
//       }
//     };

//     load();
//     const t = window.setInterval(load, 10_000);

//     return () => {
//       cancelled = true;
//       window.clearInterval(t);
//     };
//   }, []);

//   return (
//     <div className="border-b border-slate-200 bg-slate-50">
//       <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="text-sm font-medium">
//           Total students present currently:{" "}
//           <span className="rounded bg-white px-2 py-1 text-slate-900 border border-slate-200">
//             {presentCount}
//           </span>
//         </div>

//         <div className="text-sm text-slate-700">{label}</div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/api/http";

type TodayCountResponse = {
  dateKey: string;
  presentCount: number;
};

function formatNow(now: Date) {
  const dayName = now.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase();
  const dateStr = now
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/,/g, "")
    .toUpperCase();

  const time = now
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "")
    .toLowerCase();

  return `DAY: ${dayName}, ${dateStr} , TIME: ${time}`;
}

export default function TopInfoBar() {
  const [now, setNow] = useState(() => new Date());
  const [presentCount, setPresentCount] = useState<number>(0);

  const label = useMemo(() => formatNow(now), [now]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await apiGet<TodayCountResponse>("/api/attendance/today-count");
        if (!cancelled) setPresentCount(data.presentCount);
      } catch (e) {
        // keep UI stable even if backend is down
      }
    };

    load();
    const t = window.setInterval(load, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  return (
    <div className="border-b border-orange-100/70 bg-gradient-to-r from-orange-50/55 via-amber-50/50 to-orange-100/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-slate-900">
          Total students present currently:{" "}
          <span className="inline-flex items-center rounded-2xl border border-white/60 bg-gradient-to-r from-orange-50/70 via-amber-50/70 to-orange-100/60 px-3 py-1.5 text-slate-900 backdrop-blur-xl shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55),0_16px_36px_-28px_rgba(249,115,22,0.45)]">
            {presentCount}
          </span>
        </div>

        <div className="inline-flex w-fit items-center rounded-2xl border border-white/60 bg-white/45 px-3 py-1.5 text-sm text-slate-900 backdrop-blur-xl shadow-[0_16px_38px_-30px_rgba(15,23,42,0.45),0_14px_30px_-28px_rgba(249,115,22,0.22)]">
          {label}
        </div>
      </div>
    </div>
  );
}