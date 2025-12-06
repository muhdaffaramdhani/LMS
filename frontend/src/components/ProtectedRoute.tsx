import { Navigate, Outlet } from "react-router-dom";
import { authService } from "@/services/authService";

export const ProtectedRoute = () => {
  const isAuth = authService.isAuthenticated();

  // Jika tidak ada token (belum login), tendang ke halaman login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan konten halaman (Outlet)
  return <Outlet />;
};