import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import TodayFood from "@/pages/TodayFood";
import Attendance from "@/pages/Attendance";
import StudentLogin from "@/pages/login/StudentLogin";
import AdminLogin from "@/pages/login/AdminLogin";
import UpdateTodayFood from "@/pages/admin/UpdateTodayFood";
const AppRoutes = () => {
  return (
    <Routes>
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

      <Route
        path="/attendance"
        element={
          <Layout>
            <Attendance />
          </Layout>
        }
      />

      <Route
        path="/login/student"
        element={
          <Layout>
            <StudentLogin />
          </Layout>
        }
      />

      <Route
        path="/login/admin"
        element={
          <Layout>
            <AdminLogin />
          </Layout>
        }
      />
      <Route
  path="/admin/menu"
  element={
    <Layout>
      <UpdateTodayFood />
    </Layout>
  }
/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
