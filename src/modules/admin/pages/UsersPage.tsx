import { Plus, Search } from "lucide-react";
import { DataTable } from "../../../shared/components/DataTable";

const users = [
  {
    name: "Aminata Diop",
    email: "admin@nolicore.local",
    role: "ADMIN",
    scope: "Toutes les organisations",
    state: "Actif",
  },
  {
    name: "Moussa Fall",
    email: "rh@nolicore.local",
    role: "RH",
    scope: "NOLI CORE",
    state: "Actif",
  },
  {
    name: "Ibrahima Sarr",
    email: "employee@nolicore.local",
    role: "EMPLOYEE",
    scope: "Site Dakar",
    state: "Actif",
  },
];
export function UsersPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Utilisateurs & rôles</h1>
          <p>
            Contrôlez les accès et le périmètre de responsabilité des comptes.
          </p>
        </div>
        <button className="primary-button">
          <Plus size={17} />
          Inviter un utilisateur
        </button>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">RBAC</span>
            <h2>Comptes autorisés</h2>
            <p>Les comptes affichés sont des comptes de démonstration.</p>
          </div>
          <button className="icon-button" aria-label="Rechercher">
            <Search size={17} />
          </button>
        </div>
        <DataTable
          headers={["Utilisateur", "Rôle", "Périmètre", "État"]}
          loading={false}
          error={false}
          empty="Aucun utilisateur."
          rows={users.map((user) => [
            <>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </>,
            <span className="role-badge">{user.role}</span>,
            user.scope,
            <span className="status status--active">
              <i />
              {user.state}
            </span>,
          ])}
        />
      </section>
    </>
  );
}
