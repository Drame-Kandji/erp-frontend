import { ChevronDown, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../../../shared/components/DataTable'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { useDeleteRoleMutation, useRolesQuery } from '../hooks/useRolesQuery'

export function RolesPage() {
  const [page, setPage] = useState(1);
  const [organization, setOrganization] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const query = useRolesQuery({
    page,
    organization: organization || undefined,
    name: name || undefined,
  });
  const organizations = useOrganizationsLookupQuery();
  const deletion = useDeleteRoleMutation();
  const roles = query.data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));

  const remove = async (id: string, roleName: string) => {
    if (!window.confirm(`Supprimer le rôle ${roleName} ? Cette action est irréversible.`)) return;
    await deletion.mutateAsync(id);
  };
  const changeOrganization = (value: string) => {
    setOrganization(value);
    setPage(1);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Rôles &amp; permissions</h1>
          <p>Définissez les droits d’accès et le périmètre des profils métier.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/roles/new')}>
          <Plus size={17} />
          Créer un rôle
        </button>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">RBAC · CORE API</span>
            <h2>Rôles du tenant</h2>
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
              onChange={(event) => changeOrganization(event.target.value)}
            >
              <option value="">Toutes les organisations</option>
              {(organizations.data ?? []).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nom
            <input
              type="search"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un rôle…"
            />
          </label>
        </div>
        <DataTable
          headers={['Rôle', 'Code', 'Organisation', 'Permissions', 'Utilisateurs']}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun rôle disponible."
          rows={roles.map((role) => [
            <>
              <b>{role.name}</b>
              <small>{role.description || 'Sans description'}</small>
            </>,
            <span className="role-badge">{role.code}</span>,
            <OrganizationName id={role.organization} organizations={organizations.data ?? []} />,
            <span className="chips">
              {role.permissions.length > 0 ? (
                <span className="chip chip--plain">{role.permissions.length} permission(s)</span>
              ) : (
                <span className="muted-value">Aucune</span>
              )}
            </span>,
            `${role.users.length} utilisateur(s)`,
          ])}
          rowActions={(index) => {
            const role = roles[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir ${role.name}`}
                  onClick={() => navigate(`/roles/${role.id}`)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="row-action"
                  aria-label={`Modifier ${role.name}`}
                  onClick={() => navigate(`/roles/${role.id}/edit`)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="row-action row-action--danger"
                  aria-label={`Supprimer ${role.name}`}
                  onClick={() => remove(role.id, role.name)}
                  disabled={deletion.isPending}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} rôle(s)</span>
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

function OrganizationName({ id, organizations }: { id: string; organizations: { id: string; name: string }[] }) {
  return organizations.find((item) => item.id === id)?.name ?? 'Organisation indisponible';
}