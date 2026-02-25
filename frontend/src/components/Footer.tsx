import { Instagram, Linkedin, Phone, MapPin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="mt-0 border-t border-orange-100/60 bg-gradient-to-br from-orange-50/60 via-amber-50/55 to-orange-100/60 backdrop-blur-xl">

      <div className="relative mx-auto max-w-6xl px-4 py-4">

        {/* Soft orange glow background */}
        <div className="pointer-events-none absolute inset-0 opacity-70">

          <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,153,0,0.35),transparent_60%)] blur-3xl" />{" "}
          <div className="absolute -right-28 -bottom-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,220,170,0.55),transparent_60%)] blur-3xl" />{" "}
          <div className="absolute left-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85),transparent_60%)] blur-3xl" />{" "}
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">

          {/* Brand */}{" "}
          <div>

            <h2 className="text-lg font-bold tracking-tight text-slate-900">

              RADHE MESS & CAFE{" "}
            </h2>{" "}
            <p className="mt-2 text-sm text-slate-700">

              Fresh meals served daily with care and hygiene.{" "}
            </p>{" "}
          </div>{" "}
          {/* Contact */}{" "}
          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3 text-slate-900">

              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/60 bg-gradient-to-br from-orange-50/70 via-amber-50/70 to-orange-100/60 backdrop-blur-xl shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55),0_16px_36px_-28px_rgba(249,115,22,0.45)]">
                {" "}
                <Phone size={16} />{" "}
              </span>{" "}
              <span>+91 8318096882</span>{" "}
            </div>{" "}
            <div className="flex items-start gap-3 text-slate-900">
              {" "}
              <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-white/60 bg-gradient-to-br from-orange-50/70 via-amber-50/70 to-orange-100/60 backdrop-blur-xl shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55),0_16px_36px_-28px_rgba(249,115,22,0.45)]">
                {" "}
                <MapPin size={16} />{" "}
              </span>{" "}
              <span>
                {" "}
                E-6, Bhai Ji Market, Bishanpura, <br /> Sector 58 Noida —
                201301{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Social */}{" "}
          <div>
            {" "}
            <div className="text-sm font-medium text-slate-900 mb-3">
              {" "}
              Connect with us{" "}
            </div>{" "}
            <div className="flex gap-3">
              {" "}
              <a
                href="https://instagram.com"
                target="_blank"
                className="rounded-2xl border border-white/60 bg-gradient-to-br from-orange-50/70 via-amber-50/70 to-orange-100/60 p-3 backdrop-blur-xl shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55),0_16px_36px_-28px_rgba(249,115,22,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-48px_rgba(15,23,42,0.65),0_22px_56px_-46px_rgba(249,115,22,0.55)]"
              >
                {" "}
                <Instagram size={18} />{" "}
              </a>{" "}
              <a
                href="https://linkedin.com"
                target="_blank"
                className="rounded-2xl border border-white/60 bg-gradient-to-br from-orange-50/70 via-amber-50/70 to-orange-100/60 p-3 backdrop-blur-xl shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55),0_16px_36px_-28px_rgba(249,115,22,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-48px_rgba(15,23,42,0.65),0_22px_56px_-46px_rgba(249,115,22,0.55)]"
              >
                {" "}
                <Linkedin size={18} />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Bottom copyright */}{" "}
        <div className="relative mt-10 border-t border-orange-100/60 pt-5 text-center text-xs text-slate-800">
          {" "}
          © {new Date().getFullYear()} Radhe Mess & Cafe. All rights
          reserved.{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
