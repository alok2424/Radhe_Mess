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

  const navBtnBase =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors border";
  const idle = "border-slate-200 bg-white hover:bg-slate-50";
  const active = "border-slate-900 bg-slate-900 text-white hover:bg-slate-800";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white font-bold">
            R
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">RADHE</div>
            <div className="text-xs text-slate-500">MESS & CAFE</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`${navBtnBase} ${idle} gap-2`}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              LOGIN <ChevronDown size={16} />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
              >
                <button
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login/student");
                  }}
                >
                  Student Login
                </button>
                <button
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
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

          <Link
            to="/today-food"
            className={`${navBtnBase} ${isActive("/today-food") ? active : idle}`}
          >
            Today&apos;s Food
          </Link>

          <Link
            to="/attendance"
            className={`${navBtnBase} ${isActive("/attendance") ? active : idle}`}
          >
            Mark Attendance
          </Link>
        </nav>
      </div>
    </header>
  );
}
