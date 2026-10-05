import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../shared/stores/auth.store";
import type { UserRole } from "../../shared/types/auth";

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user } = useAuthStore();
  const location = useLocation();
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
