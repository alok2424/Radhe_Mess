import { Instagram, Linkedin, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold">RADHE MESS & CAFE</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fresh meals served daily with care and hygiene.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone size={16} />
              <span>+91 8318096882</span>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <MapPin size={16} className="mt-1" />
              <span>
                E-6, Bhai Ji Market, Bishanpura,
                <br />
                Sector 58 Noida — 201301
              </span>
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">
              Connect with us
            </div>

            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Radhe Mess & Cafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
