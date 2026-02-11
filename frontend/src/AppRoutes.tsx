import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import TodayFood from "@/pages/TodayFood";
import Attendance from "@/pages/Attendance";

// Student auth
import StudentLogin from "@/pages/login/StudentLogin";
import StudentOnly from "@/auth/StudentOnly";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminOnly from "@/auth/AdminOnly";
import AdminHome from "@/pages/admin/AdminHome";
import UpdateTodayFood from "@/pages/admin/UpdateTodayFood";
import DashboardAnalytics from "@/pages/admin/DashboardAnalytics";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <Layout>
            <TodayFood />
          </Layout>
        }
      />

      <Route
        path="/today-food"
        element={
          <Layout>
            <TodayFood />
          </Layout>
        }
      />

      {/* ✅ Student login (public) */}
      <Route
        path="/login/student"
        element={
          <Layout>
            <StudentLogin />
          </Layout>
        }
      />

      {/* ✅ Attendance (student protected) */}
      <Route
        path="/attendance"
        element={
          <StudentOnly>
            <Layout>
              <Attendance />
            </Layout>
          </StudentOnly>
        }
      />

      {/* Admin login (public) */}
      <Route
        path="/login/admin"
        element={
          <Layout>
            <AdminLogin />
          </Layout>
        }
      />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <AdminOnly>
            <Layout>
              <AdminHome />
            </Layout>
          </AdminOnly>
        }
      />

      <Route
        path="/admin/menu"
        element={
          <AdminOnly>
            <Layout>
              <UpdateTodayFood />
            </Layout>
          </AdminOnly>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminOnly>
            <Layout>
              <DashboardAnalytics />
            </Layout>
          </AdminOnly>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
