import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import type { AppRoute } from "../../types/navigation";
import { navigation } from "../../constants/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!user) return null;
  const route = (location.pathname.split("/")[1] || "dashboard") as AppRoute;
  const title =
    navigation
      .flatMap((section) => section.items)
      .find((item) => item.route === route)?.label ?? "Tableau de bord";
  const logout = () => {
    signOut();
    navigate("/login", { replace: true });
  };
  return (
    <div className="app-shell">
      <Sidebar
        role={user.role}
        activeRoute={route}
        onNavigate={(nextRoute) => navigate(`/${nextRoute}`)}
        onSignOut={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
      <main className="main-area">
        <Topbar
          user={user}
          title={title}
          onMenu={() => setSidebarOpen(true)}
          onSignOut={logout}
        />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
