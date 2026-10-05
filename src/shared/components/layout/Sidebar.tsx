import { ChevronDown, CircleHelp, LogOut } from "lucide-react";
import { navigation } from "../../constants/navigation";
import type { AppRoute } from "../../types/navigation";
import type { UserRole } from "../../types/auth";

export function Sidebar({
  role,
  activeRoute,
  onNavigate,
  onSignOut,
  isOpen,
  onClose,
}: {
  role: UserRole;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onSignOut: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">N</span>
        <span>
          NOLI <b>CORE</b>
        </span>
        <button
          className="icon-button mobile-only"
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          ×
        </button>
      </div>
      <div className="workspace-switcher">
        <span className="workspace-dot" />
        <span>
          <small>Organisation active</small>
          <strong>NOLI CORE</strong>
        </span>
        <ChevronDown size={15} />
      </div>
      <nav className="sidebar-nav">
        {navigation.map((section) => {
          const items = section.items.filter((item) =>
            item.roles.includes(role),
          );
          if (!items.length) return null;
          return (
            <div className="nav-section" key={section.label}>
              <span className="nav-label">{section.label}</span>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className={`nav-item ${activeRoute === item.route ? "nav-item--active" : ""}`}
                    key={`${section.label}-${item.label}`}
                    onClick={() => {
                      onNavigate(item.route);
                      onClose();
                    }}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item">
          <CircleHelp size={17} />
          Centre d'aide
        </button>
        <button className="nav-item" onClick={onSignOut}>
          <LogOut size={17} />
          Se déconnecter
        </button>
        <div className="api-status">
          <span className="pulse" />
          <span>
            <b>
              {import.meta.env.VITE_DATA_SOURCE === "mock"
                ? "MODE DÉMO"
                : "CORE API"}
            </b>
            <small>
              {import.meta.env.VITE_DATA_SOURCE === "mock"
                ? "Services mockés sans base de données"
                : "Connecté au backend Django"}
            </small>
          </span>
        </div>
      </div>
    </aside>
  );
}
