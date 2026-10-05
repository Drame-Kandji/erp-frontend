import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import type { AuthUser } from "../../types/auth";

export function Topbar({
  user,
  title,
  onMenu,
  onSignOut,
}: {
  user: AuthUser;
  title: string;
  onMenu: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="topbar">
      <button
        className="icon-button mobile-only"
        onClick={onMenu}
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>
      <div className="breadcrumbs">
        <span>NOLI CORE</span>
        <span>/</span>
        <b>{title}</b>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Rechercher">
          <Search size={18} />
        </button>
        <button
          className="icon-button notification-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>
        <details className="profile-wrap">
          <summary className="profile-button">
            <span className="avatar">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="profile-copy">
              <b>{user.name}</b>
              <small>{user.role}</small>
            </span>
            <ChevronDown size={15} />
          </summary>
          <div className="role-menu">
            <small>{user.email}</small>
            <button onClick={onSignOut}>Se déconnecter</button>
          </div>
        </details>
      </div>
    </header>
  );
}
