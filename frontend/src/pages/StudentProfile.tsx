import { useEffect, useState } from "react";
import { apiGet } from "@/api/http";
import { getStudentToken } from "@/auth/studentSession";

type StudentMe = {
  email: string;
  name: string;
  rollNo: string;
  foodTokens: number;
  photoUrl?: string;
};

export default function StudentProfile() {
  const [me, setMe] = useState<StudentMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStudentToken();

    (async () => {
      try {
        const data = await apiGet<StudentMe>("/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!me) return <div>Failed to load profile.</div>;

  const initials = me.name ? me.name.split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase() : "S";

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-sm text-slate-600">Your details and food tokens.</p>
      </div>

      <div className="max-w-xl rounded-md border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          {me.photoUrl ? (
            <img src={me.photoUrl} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white font-bold">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{me.name}</div>
            <div className="text-sm text-slate-600 truncate">{me.email}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Roll No</div>
            <div className="font-semibold">{me.rollNo}</div>
          </div>

          <div className="rounded-md border border-slate-200 p-3">
            <div className="text-xs text-slate-500">Food Tokens</div>
            <div className="font-semibold">{me.foodTokens}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
