// import { useMemo, useState } from "react";
// import { useToast } from "@/components/ToastProvider";

// type FoodItem = { name: string; imageUrl: string };

// const emptyItems: FoodItem[] = Array.from({ length: 5 }).map(() => ({
//   name: "",
//   imageUrl: "",
// }));

// export default function UpdateTodayFood() {
//   const { showToast } = useToast();

//   const [adminKey, setAdminKey] = useState("");
//   const [items, setItems] = useState<FoodItem[]>(emptyItems);
//   const [saving, setSaving] = useState(false);

//   const apiBase = import.meta.env.VITE_API_BASE_URL as string;

// //   const isValid = useMemo(() => {
// //     return (
// //       adminKey.trim().length > 0 &&
// //       items.length === 5 &&
// //       items.every((i) => i.name.trim().length >= 2 && i.imageUrl.trim().length > 0)
// //     );
// //   }, [adminKey, items]);
// const isValid = useMemo(() => {
//   return (
//     adminKey.trim().length > 0 &&
//     items.length === 5 &&
//     items.every((i) => i.name.trim().length >= 2)
//   );
// }, [adminKey, items]);

//   const updateItem = (idx: number, key: keyof FoodItem, value: string) => {
//     setItems((prev) => {
//       const copy = [...prev];
//       copy[idx] = { ...copy[idx], [key]: value };
//       return copy;
//     });
//   };

//   const save = async () => {
//     if (!isValid) {
//       showToast("Fill admin key + all 5 items (name + imageUrl).", "error");
//       return;
//     }

//     try {
//       setSaving(true);

//       const res = await fetch(`${apiBase}/api/food/today`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "x-admin-key": adminKey.trim(),
//         },
//         body: JSON.stringify({ items }),
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         throw new Error((data && data.message) || "Failed to update menu");
//       }

//       showToast("Today's menu updated ✅", "success");
//     } catch (e: any) {
//       showToast(e?.message || "Failed to update menu", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Admin: Update Today’s Food</h1>
//         <p className="text-sm text-slate-600">
//           Update exactly 5 items for today’s menu.
//         </p>
//       </div>

//       <div className="max-w-xl space-y-3 rounded-md border border-slate-200 bg-white p-4">
//         <label className="block text-sm font-medium text-slate-700">
//           Admin Key
//         </label>
//         <input
//           value={adminKey}
//           onChange={(e) => setAdminKey(e.target.value)}
//           placeholder="Enter ADMIN_API_KEY"
//           className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//         />

//         <div className="pt-2 text-sm font-semibold">Today’s 5 Items</div>

//         <div className="space-y-3">
//           {items.map((it, idx) => (
//             <div key={idx} className="rounded-md border border-slate-200 p-3">
//               <div className="text-sm font-medium mb-2">Item {idx + 1}</div>

//               <div className="grid gap-2">
//                 <input
//                   value={it.name}
//                   onChange={(e) => updateItem(idx, "name", e.target.value)}
//                   placeholder="Food name"
//                   className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//                 />
//                 <input
//                   value={it.imageUrl}
//                   onChange={(e) => updateItem(idx, "imageUrl", e.target.value)}
//                   placeholder="Image URL (https://...)"
//                   className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={save}
//           disabled={saving}
//           className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//         >
//           {saving ? "Saving..." : "Save Today’s Menu"}
//         </button>
//       </div>
//     </section>
//   );
// }


// import { useEffect, useState } from "react";
// import { useToast } from "@/components/ToastProvider";
// import { apiGet, apiPost } from "@/api/http";
// import { getAdminToken } from "@/auth/adminSession";
// import { useNavigate } from "react-router-dom";

// type FoodItem = { name: string; imageUrl?: string };
// type TodayFoodResponse = { dateKey: string; items: FoodItem[]; source: string };

// export default function UpdateTodayFood() {
//   const { showToast } = useToast();
//   const navigate = useNavigate();
//   const token = getAdminToken();

//   const [items, setItems] = useState<FoodItem[]>(
//     Array.from({ length: 5 }).map(() => ({ name: "", imageUrl: "" }))
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // ✅ if not logged in, go to admin login
//     if (!token) {
//       showToast("Admin not logged in", "error");
//       navigate("/login/admin", { replace: true, state: { from: "/admin/menu" } });
//       return;
//     }

//     // preload today's menu
//     (async () => {
//       try {
//         const data = await apiGet<TodayFoodResponse>("/api/food/today");
//         if (Array.isArray(data.items) && data.items.length === 5) setItems(data.items);
//       } catch {
//         // ignore
//       }
//     })();
//   }, [token, navigate, showToast]);

//   const updateItem = (idx: number, patch: Partial<FoodItem>) => {
//     setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
//   };

//   const save = async () => {
//     if (!token) {
//       showToast("Admin not logged in", "error");
//       navigate("/login/admin", { replace: true, state: { from: "/admin/menu" } });
//       return;
//     }

//     for (const it of items) {
//       if (!String(it.name || "").trim()) {
//         showToast("All 5 food names are required", "error");
//         return;
//       }
//     }

//     try {
//       setLoading(true);

//       await apiPost(
//         "/api/food/today",
//         { items },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // ✅ THIS WAS MISSING
//           },
//         }
//       );

//       showToast("Menu updated ✅", "success");
//     } catch (e: any) {
//       showToast(e?.message || "Failed to update menu", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="space-y-4">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Update Today’s Menu</h1>
//         <p className="text-sm text-slate-600">Admin only.</p>
//       </div>

//       <div className="space-y-3">
//         {items.map((it, idx) => (
//           <div key={idx} className="rounded-md border border-slate-200 bg-white p-4">
//             <div className="text-sm font-semibold mb-2">Item {idx + 1}</div>

//             <input
//               value={it.name}
//               onChange={(e) => updateItem(idx, { name: e.target.value })}
//               placeholder="Food name"
//               className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             />

//             <input
//               value={it.imageUrl || ""}
//               onChange={(e) => updateItem(idx, { imageUrl: e.target.value })}
//               placeholder="Image URL (optional)"
//               className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             />
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={save}
//         disabled={loading}
//         className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
//       >
//         {loading ? "Saving..." : "Save Today’s Menu"}
//       </button>
//     </section>
//   );
// }


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

