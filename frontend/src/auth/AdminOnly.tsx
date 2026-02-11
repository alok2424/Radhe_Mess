import { Navigate, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "./adminSession";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isAdminLoggedIn()) {
    return <Navigate to="/login/admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
    