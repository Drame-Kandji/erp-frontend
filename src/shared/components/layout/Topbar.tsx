import { useRef } from "react";
import { Bell, ChevronDown, Menu, Search, UserRound } from "lucide-react";
import type { AuthUser } from "../../types/auth";
import type { AppRoute } from "../../types/navigation";

export function Topbar({
  user,
  title,
  onMenu,
  onSignOut,
  onNavigate,
}: {
  user: AuthUser;
  title: string;
  onMenu: () => void;
  onSignOut: () => void;
  onNavigate: (route: AppRoute) => void;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const go = (route: AppRoute) => {
    menuRef.current?.removeAttribute("open");
    onNavigate(route);
  };
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
        <details className="profile-wrap" ref={menuRef}>
          <summary className="profile-button">
            <span className="avatar">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="profile-copy">
              <b>{user.name}</b>
              <small>{user.roleLabel}</small>
            </span>
            <ChevronDown size={15} />
          </summary>
          <div className="role-menu">
            <small>{user.email}</small>
            <button onClick={() => go("profile")}>
              <UserRound size={15} /> Mon profil
            </button>
            <button onClick={onSignOut}>Se déconnecter</button>
          </div>
        </details>
      </div>
    </header>
  );
}
