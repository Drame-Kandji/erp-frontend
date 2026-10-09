import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../../shared/components/DataTable";
import {
  useOrganizationQuery,
  useOrganizationsQuery,
} from "../../organizations/hooks/useOrganizationsQuery";
import {
  useDeleteDepartmentMutation,
  useDepartmentsQuery,
} from "../hooks/useDepartmentsQuery";

export function DepartmentsPage() {
  const [page, setPage] = useState(1);
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const query = useDepartmentsQuery({
    page,
    organization: organization || undefined,
    name: name || undefined,
  });
  const organizations = useOrganizationsQuery(1);
  const deletion = useDeleteDepartmentMutation();
  const departments = query.data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));

  const remove = async (id: string, name: string) => {
    if (
      !window.confirm(`Supprimer ${name} ? Cette action est irréversible.`)
    )
      return;
    await deletion.mutateAsync(id);
  };
  const changeFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Départements</h1>
          <p>Structurez les équipes internes rattachées à chaque organisation.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => navigate("/departments/new")}
        >
          <Plus size={17} />
          Ajouter un département
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
            <h2>Départements</h2>
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
          <label className="filter-search">
            Recherche
            <span className="filter-search-box">
              <Search size={14} />
              <input
                type="search"
                value={name}
                placeholder="Rechercher un département…"
                onChange={(event) =>
                  changeFilter(setName, event.target.value)
                }
              />
              {name && (
                <button
                  type="button"
                  className="filter-search-clear"
                  aria-label="Effacer la recherche"
                  onClick={() => changeFilter(setName, "")}
                >
                  <X size={13} />
                </button>
              )}
            </span>
          </label>
        </div>
        <DataTable
          headers={["Département", "Code", "Organisation"]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun département disponible."
          rows={departments.map((department) => [
            <>
              <b>{department.name}</b>
              <small>{department.description || "Sans description"}</small>
            </>,
            department.code,
            <DepartmentOrganizationName
              organizationId={department.organization}
            />,
          ])}
          rowActions={(index) => {
            const department = departments[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir ${department.name}`}
                  onClick={() => navigate(`/departments/${department.id}`)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="row-action"
                  aria-label={`Modifier ${department.name}`}
                  onClick={() => navigate(`/departments/${department.id}/edit`)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="row-action row-action--danger"
                  aria-label={`Supprimer ${department.name}`}
                  onClick={() => remove(department.id, department.name)}
                  disabled={deletion.isPending}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} département(s)</span>
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

function DepartmentOrganizationName({
  organizationId,
}: {
  organizationId: string;
}) {
  const query = useOrganizationQuery(organizationId);
  if (query.isLoading) return <span className="muted-value">Chargement…</span>;
  return query.data?.name ?? "Organisation indisponible";
}