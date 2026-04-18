import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminRoutes from "./admin/routes/AdminRoutes";
import OfficerRoutes from "./officer/routes/OfficerRoutes";

import Intro from "@/components/Intro";

import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import GalleryPage from "./pages/GalleryPage";
import NssUnitsPage from "./pages/NssUnitsPage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContactPage from "./pages/ContactPage";
import NssDigestPage from "./pages/NssDigestPage"; 
import UnitActivitiesPage from "./pages/UnitActivitiesPage";
import UnitActivityDetailPage from "./pages/UnitActivityDetailPage";
import UnitVolunteersPage from "./pages/UnitVolunteersPage";
import NssAwardsPage from "./pages/NssAwardsPage";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Main Website */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="nssunits" element={<NssUnitsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="intro" element={<Intro />} />
          <Route path="nss-digest" element={<NssDigestPage />} /> 
          <Route path="unit-activities" element={<UnitActivitiesPage />} />
          <Route path="unit-activities/:id" element={<UnitActivityDetailPage />} />
          <Route path="unit-volunteers" element={<UnitVolunteersPage />} />
          <Route path="awards" element={<NssAwardsPage />} />
        </Route>

        {/* Officer Portal */}
        <Route path="/officer/*" element={<OfficerRoutes />} />

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminRoutes />} />

      </Routes>
    </Router>
  );
}