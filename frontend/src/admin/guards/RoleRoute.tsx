import { Navigate, Outlet } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const adminStr = localStorage.getItem("admin");

  if (!adminStr) {
    return <Navigate to="/admin/login" replace />;
  }

  let admin: any;

  try {
    admin = JSON.parse(adminStr);
  } catch {
    // Invalid admin data
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}