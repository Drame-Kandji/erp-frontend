import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SplashScreen } from "../../shared/components/SplashScreen";
import { useAuthStore } from "../../shared/stores/auth.store";
import type { UserRole } from "../../shared/types/auth";

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === "idle" || status === "loading") return <SplashScreen />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
