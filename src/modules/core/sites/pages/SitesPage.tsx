import { ChevronDown, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../../shared/components/DataTable";
import {
  useOrganizationQuery,
  useOrganizationsQuery,
} from "../../organizations/hooks/useOrganizationsQuery";
import { useDeleteSiteMutation, useSitesQuery } from "../hooks/useSitesQuery";

export function SitesPage() {
  const [page, setPage] = useState(1);
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const query = useSitesQuery({
    page,
    organization: organization || undefined,
    status: status || undefined,
  });
  const organizations = useOrganizationsQuery(1);
  const deletion = useDeleteSiteMutation();
  const sites = query.data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer ${name} ? Cette action est irréversible.`))
      return;
    await deletion.mutateAsync(id);
  };
  const changeFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Sites</h1>
          <p>Suivez les implantations opérationnelles et leurs coordonnées.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => navigate("/sites/new")}
        >
          <Plus size={17} />
          Ajouter un site
        </button>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">
              CORE API ·{" "}
              {import.meta.env.VITE_DATA_SOURCE === "mock"
                ? "MODE DÉMO"
                : "CONNECTÉE"}
            </span>
            <h2>Sites opérationnels</h2>
            {/* <p>Contrat Django REST Framework `/api/v1/sites/`.</p> */}
          </div>
          <div className="table-tools">
            <button className="icon-button" aria-label="Rechercher">
              <Search size={17} />
            </button>
            <button className="filter-button">
              Filtres <ChevronDown size={15} />
            </button>
          </div>
        </div>
        <div className="resource-filters">
          <label>
            Organisation
            <select
              value={organization}
              onChange={(event) =>
                changeFilter(setOrganization, event.target.value)
              }
            >
              <option value="">Toutes les organisations</option>
              {(organizations.data?.results ?? []).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Statut
            <select
              value={status}
              onChange={(event) => changeFilter(setStatus, event.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </label>
        </div>
        <DataTable
          headers={["Site", "Code", "Organisation", "Statut", "Coordonnées"]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun site disponible."
          rows={sites.map((site) => [
            <>
              <b>{site.name}</b>
              <small>{site.address || "Adresse non renseignée"}</small>
            </>,
            site.code,
            <SiteOrganizationName organizationId={site.organization} />,
            <Status value={site.status} />,
            site.latitude && site.longitude
              ? `${site.latitude}, ${site.longitude}`
              : "Non renseignées",
          ])}
          rowActions={(index) => {
            const site = sites[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir ${site.name}`}
                  onClick={() => navigate(`/sites/${site.id}`)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="row-action"
                  aria-label={`Modifier ${site.name}`}
                  onClick={() => navigate(`/sites/${site.id}/edit`)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="row-action row-action--danger"
                  aria-label={`Supprimer ${site.name}`}
                  onClick={() => remove(site.id, site.name)}
                  disabled={deletion.isPending}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} site(s)</span>
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

function SiteOrganizationName({ organizationId }: { organizationId: string }) {
  const query = useOrganizationQuery(organizationId);
  if (query.isLoading) return <span className="muted-value">Chargement…</span>;
  return query.data?.name ?? "Organisation indisponible";
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
