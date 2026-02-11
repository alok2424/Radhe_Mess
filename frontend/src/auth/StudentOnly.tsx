// import { Navigate, useLocation } from "react-router-dom";
// import { isStudentLoggedIn } from "./studentSession";

// export default function StudentOnly({ children }: { children: React.ReactNode }) {
//   const location = useLocation();

//   if (!isStudentLoggedIn()) {
//     return <Navigate to="/login/student" replace state={{ from: location.pathname }} />;
//   }

//   return <>{children}</>;
// }

import { Navigate, useLocation } from "react-router-dom";
import { isStudentLoggedIn } from "@/auth/studentSession";

export default function StudentOnly({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isStudentLoggedIn()) {
    return <Navigate to="/login/student" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
