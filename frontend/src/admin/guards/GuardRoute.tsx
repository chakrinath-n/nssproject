import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function GuardRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login, saving the attempted URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Token exists, render child routes
  return <Outlet />;
}
