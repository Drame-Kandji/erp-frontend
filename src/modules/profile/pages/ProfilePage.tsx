import { BadgeCheck, KeyRound } from "lucide-react";
import { useAuthStore } from "../../../shared/stores/auth.store";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)!;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MON ESPACE</span>
          <h1>Mon profil</h1>
          <p>Consultez vos informations personnelles et vos accès.</p>
        </div>
        <span className="coming-soon-badge coming-soon-badge--ok">
          <BadgeCheck size={14} /> {user.roleLabel}
        </span>
      </div>

      <section className="panel profile-hero">
        <span className="avatar avatar--lg">{initials}</span>
        <div className="profile-hero-copy">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="chips">
            {user.roles.map((role) => (
              <span className="chip" key={role.code}>
                {role.name}
              </span>
            ))}
            {user.isSuperuser && (
              <span className="chip chip--gold">Super utilisateur</span>
            )}
            {!user.roles.length && <span className="chip">Aucun rôle</span>}
          </div>
        </div>
      </section>

      <div className="detail-grid profile-grid">
        <section className="panel detail-card">
          <span className="eyebrow">IDENTITÉ</span>
          <div className="detail-row">
            <span>Nom complet</span>
            <b>{user.name}</b>
          </div>
          <div className="detail-row">
            <span>Prénom</span>
            <b>{user.firstName || "—"}</b>
          </div>
          <div className="detail-row">
            <span>Nom</span>
            <b>{user.lastName || "—"}</b>
          </div>
          <div className="detail-row">
            <span>Adresse email</span>
            <b>{user.email}</b>
          </div>
        </section>

        <section className="panel detail-card">
          <span className="eyebrow">ORGANISATION</span>
          <div className="detail-row">
            <span>Organisation active</span>
            <b>{user.organizationName}</b>
          </div>
          <div className="detail-row">
            <span>Code organisation</span>
            <b>{user.organizationCode ?? "—"}</b>
          </div>
          <div className="detail-row">
            <span>Identifiant</span>
            <b>{user.organizationId ?? "—"}</b>
          </div>
        </section>

        <section className="panel detail-card">
          <span className="eyebrow">ACCÈS &amp; SÉCURITÉ</span>
          <div className="detail-row">
            <span>Rôle principal</span>
            <b>{user.roleLabel}</b>
          </div>
          {/* <div className="detail-row">
            <span>Permissions</span>
            <b>{user.permissions.length} autorisation(s)</b>
          </div> */}
          <div className="detail-row">
            <span>Mot de passe</span>
            <b>••••••••</b>
            {/* <b>Géré par votre administrateur</b> */}
          </div>
          <button className="secondary-button profile-action" type="button" disabled>
            <KeyRound size={15} /> Modifier le mot de passe (bientôt)
          </button>
        </section>
      </div>
    </>
  );
}
