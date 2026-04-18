// src/officer/routes/OfficerRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import OfficerLayout from "../layouts/OfficerLayout";
import Login from "../pages/Login";

// import all your officer pages...
import Dashboard from "../pages/Dashboard";
import AddVolunteer from "../pages/AddVolunteer";
import ViewVolunteers from "../pages/ViewVolunteers";
import RegularActivityReport from "../pages/RegularActivityReport";
import ActivityDetails from "../pages/ActivityDetails";
import AddCampReport from "../pages/AddCampReport";
import ViewCampReports from "../pages/ViewCampReports";
import SocialLinks from "../pages/SocialLinks";
import ChangePassword from "../pages/ChangePassword";

export default function OfficerRoutes() {
  return (
    <Routes>

      {/* ✅ Public — login page (no protection) */}
<Route path="login" element={<Login />} />  {/* ✅ Login not OfficerLogin */}

      {/* ✅ All protected routes wrapped inside ProtectedRoute */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <OfficerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"          element={<Dashboard />} />
        <Route path="volunteers/add"     element={<AddVolunteer />} />
        <Route path="volunteers"         element={<ViewVolunteers />} />
        <Route path="regular-report/:typeId" element={<RegularActivityReport />} />
        <Route path="activity-details"   element={<ActivityDetails />} />
        <Route path="special-camp/add"   element={<AddCampReport />} />
        <Route path="special-camp/view"  element={<ViewCampReports />} />
        <Route path="social"             element={<SocialLinks />} />
        <Route path="change-password"    element={<ChangePassword />} />
      </Route>

    </Routes>
  );
}