// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ChevronDown } from "lucide-react";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!dropdownRef.current) return;
//       if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const navBtnBase =
//     "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors border";
//   const idle = "border-slate-200 bg-white hover:bg-slate-50";
//   const active = "border-slate-900 bg-slate-900 text-white hover:bg-slate-800";

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
//       <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
//         <Link to="/" className="flex items-center gap-2">
//           <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white font-bold">
//             R
//           </div>
//           <div className="leading-tight">
//             <div className="text-sm font-semibold">RADHE</div>
//             <div className="text-xs text-slate-500">MESS & CAFE</div>
//           </div>
//         </Link>

//         <nav className="flex items-center gap-2">
//           <div className="relative" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => setOpen((v) => !v)}
//               className={`${navBtnBase} ${idle} gap-2`}
//               aria-haspopup="menu"
//               aria-expanded={open}
//             >
//               LOGIN <ChevronDown size={16} />
//             </button>

//             {open && (
//               <div
//                 role="menu"
//                 className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
//               >
//                 <button
//                   role="menuitem"
//                   className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/login/student");
//                   }}
//                 >
//                   Student Login
//                 </button>
//                 <button
//                   role="menuitem"
//                   className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
//                   onClick={() => {
//                     setOpen(false);
//                     navigate("/login/admin");
//                   }}
//                 >
//                   Admin Login
//                 </button>
//               </div>
//             )}
//           </div>

//           <Link
//             to="/today-food"
//             className={`${navBtnBase} ${isActive("/today-food") ? active : idle}`}
//           >
//             Today&apos;s Food
//           </Link>

//           <Link
//             to="/attendance"
//             className={`${navBtnBase} ${isActive("/attendance") ? active : idle}`}
//           >
//             Mark Attendance
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const pillBase =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold border backdrop-blur transition duration-200";

  // Glass but slightly orange tinted
  const glassPill =
    "border-orange-100/70 bg-white/55 text-slate-900 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.5),0_14px_30px_-30px_rgba(249,115,22,0.22)] hover:bg-orange-50/60 hover:-translate-y-[1px]";

  // CTA orange filled
  const orangePill =
    "border-white/55 text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 shadow-[0_20px_44px_-34px_rgba(15,23,42,0.65),0_18px_40px_-32px_rgba(249,115,22,0.55)] hover:opacity-95 hover:-translate-y-[1px]";

  // Premium outline like your screenshot
  const outlinePill =
    "border-orange-200/80 bg-white/45 text-slate-900 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.45),0_14px_28px_-28px_rgba(249,115,22,0.18)] hover:border-orange-300/90 hover:bg-orange-50/55 hover:-translate-y-[1px]";

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/70 bg-orange-50/30 backdrop-blur">
      {/* Rounded container bar with warm tint */}
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="relative overflow-visible rounded-3xl border border-orange-100/70 bg-white/55 px-4 py-3 backdrop-blur-xl shadow-[0_26px_60px_-44px_rgba(15,23,42,0.55),0_22px_50px_-42px_rgba(249,115,22,0.32)]">
          {/* warm highlights */}
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,153,0,0.28),transparent_60%)] blur-3xl" />
            <div className="absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_60%)] blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between gap-3">
            {/* Brand */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl text-white font-bold shadow-[0_18px_40px_-30px_rgba(249,115,22,0.55)]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-400" />
                <div className="absolute inset-0 opacity-60 blur-xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_55%)]" />
                <span className="relative">R</span>
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight text-slate-900">
                  RADHE
                </div>
                <div className="text-xs text-slate-600">MESS &amp; CAFE</div>
              </div>
            </Link>

            {/* Buttons */}
            <nav className="flex items-center gap-2">
              {/* LOGIN dropdown (functionality preserved) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className={`${pillBase} ${glassPill} gap-2`}
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  LOGIN
                  <ChevronDown
                    size={16}
                    className={`transition duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-orange-100/80 bg-white/70 backdrop-blur-xl shadow-[0_30px_70px_-46px_rgba(15,23,42,0.68),0_24px_54px_-44px_rgba(249,115,22,0.38)]"
                  >
                    <button
                      role="menuitem"
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-orange-50/70"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login/student");
                      }}
                    >
                      Student Login
                    </button>
                    <div className="h-px bg-orange-100/70" />
                    <button
                      role="menuitem"
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-orange-50/70"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login/admin");
                      }}
                    >
                      Admin Login
                    </button>
                  </div>
                )}
              </div>

              {/* Today’s Food */}
              <Link
                to="/today-food"
                className={`${pillBase} ${isActive("/today-food") ? orangePill : glassPill}`}
              >
                Today&apos;s Food
              </Link>

              {/* Mark Attendance */}
              <Link
                to="/attendance"
                className={`${pillBase} ${isActive("/attendance") ? orangePill : outlinePill}`}
              >
                Mark Attendance
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}