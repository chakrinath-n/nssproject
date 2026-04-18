import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import GuardRoute from "../guards/GuardRoute";
import Images from "../pages/Images";
import Activities from "../pages/Activities";
import Login from "../pages/Login";
import NssUnits from "../pages/NssUnits";
import Reports from "../pages/Reports";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Admins from "../pages/Admin";
import About from "../pages/About";
import Awards from "../pages/Awards";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route element={<GuardRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="images" element={<Images />} />
          <Route path="activities" element={<Activities />} />
          <Route path="nssunits" element={<NssUnits />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admins" element={<Admins />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="about" element={<About />} />
          <Route path="awards" element={<Awards />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}