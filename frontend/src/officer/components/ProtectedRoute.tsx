
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("officer_token");
  if (!token) return <Navigate to="/officer/login" replace />;
  return <>{children}</>;
}