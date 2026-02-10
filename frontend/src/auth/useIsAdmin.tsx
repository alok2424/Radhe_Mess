import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ROLES_CLAIM = "https://radhe.app/roles";

function parseEmails(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function useIsAdmin() {
  const { user, isAuthenticated } = useAuth0();

  return useMemo(() => {
    if (!isAuthenticated || !user) return false;

    // ✅ Preferred: Auth0 custom claim: ["admin"]
    const roles = (user as any)[ROLES_CLAIM] as string[] | undefined;
    if (Array.isArray(roles) && roles.map((r) => r.toLowerCase()).includes("admin")) {
      return true;
    }

    // ✅ Fallback: email allowlist
    const allow = parseEmails(import.meta.env.VITE_ADMIN_EMAILS as string | undefined);
    const email = String((user as any).email || "").toLowerCase();
    return allow.includes(email);
  }, [isAuthenticated, user]);
}
