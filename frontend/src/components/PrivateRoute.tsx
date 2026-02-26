import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute() {
  const { token, isReady } = useAuth();

  if (!isReady) return <div className="loading">로딩 중...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}