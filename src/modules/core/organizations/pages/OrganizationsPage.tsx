import { ChevronDown, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../../shared/components/DataTable";
import {
  useDeleteOrganizationMutation,
  useOrganizationsQuery,
} from "../hooks/useOrganizationsQuery";

export function OrganizationsPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const query = useOrganizationsQuery(page);
  const deletion = useDeleteOrganizationMutation();
  const organizations = query.data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));
  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer ${name} ? Cette action est irréversible.`))
      return;
    await deletion.mutateAsync(id);
  };
  return (
    <>
      <PageHeading
        title="Organisations"
        description="Gérez les entités rattachées à votre environnement NOLI CORE."
        action="Ajouter une organisation"
        onAction={() => navigate("/organizations/new")}
      />
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">
              CORE API ·{" "}
              {import.meta.env.VITE_DATA_SOURCE === "mock"
                ? "MODE DÉMO"
                : "CONNECTÉE"}
            </span>
            <h2>Registre des organisations</h2>
            {/* <p>Contrat Django REST Framework `/api/v1/organizations/`.</p> */}
          </div>
          <div className="table-tools">
            <button className="icon-button" aria-label="Rechercher">
              <Search size={17} />
            </button>
            <button className="filter-button">
              Filtrer <ChevronDown size={15} />
            </button>
          </div>
        </div>
        <DataTable
          headers={[
            "Organisation",
            "Code",
            "Statut",
            "Configuration",
            "Créée le",
          ]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucune organisation disponible."
          rows={organizations.map((organization) => [
            <>
              <b>{organization.name}</b>
              <small>{organization.description}</small>
            </>,
            organization.code,
            <Status value={organization.status} />,
            `${organization.configuration.currency} · ${organization.configuration.language}`,
            formatDate(organization.created_at),
          ])}
          rowActions={(index) => {
            const organization = organizations[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir ${organization.name}`}
                  onClick={() => navigate(`/organizations/${organization.id}`)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="row-action"
                  aria-label={`Modifier ${organization.name}`}
                  onClick={() =>
                    navigate(`/organizations/${organization.id}/edit`)
                  }
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="row-action row-action--danger"
                  aria-label={`Supprimer ${organization.name}`}
                  onClick={() => remove(organization.id, organization.name)}
                  disabled={deletion.isPending}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} organisation(s)</span>
          <div>
            <button
              className="secondary-button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Précédent
            </button>
            <strong>
              Page {page} / {pageCount}
            </strong>
            <button
              className="secondary-button"
              disabled={page >= pageCount}
              onClick={() => setPage((current) => current + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
function PageHeading({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">ADMINISTRATION</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <button className="primary-button" onClick={onAction}>
        <Plus size={17} />
        {action}
      </button>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className={`status status--${value}`}>
      <i />
      {value === "active"
        ? "Actif"
        : value === "inactive"
          ? "Inactif"
          : "Suspendu"}
    </span>
  );
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
