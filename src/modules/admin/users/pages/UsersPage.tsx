import { ChevronDown, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../../../shared/components/DataTable'
import { useDepartmentsLookupQuery } from '../../../core/departments/hooks/useDepartmentsQuery'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { useSitesLookupQuery } from '../../../core/sites/hooks/useSitesQuery'
import type { User } from '../domain/user'
import { useRolesLookupQuery } from '../../roles/hooks/useRolesQuery'
import { useDeleteUserMutation, useUsersQuery } from '../hooks/useUsersQuery'

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [organization, setOrganization] = useState('');
  const [site, setSite] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const organizationScope = organization || undefined;
  const query = useUsersQuery({
    page,
    organization: organizationScope,
    site: site || undefined,
    department: department || undefined,
    status: status || undefined,
  });
  const organizations = useOrganizationsLookupQuery();
  const sites = useSitesLookupQuery(organizationScope);
  const departments = useDepartmentsLookupQuery(organizationScope);
  const roles = useRolesLookupQuery();
  const deletion = useDeleteUserMutation();
  const users = query.data?.results ?? [];
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer le compte ${name} ? Cette action est irréversible.`)) return;
    await deletion.mutateAsync(id);
  };
  const changeFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };
  const changeOrganization = (value: string) => {
    setOrganization(value);
    setSite('');
    setDepartment('');
    setPage(1);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Utilisateurs &amp; rôles</h1>
          <p>Contrôlez les accès et le rattachement des comptes du tenant.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/users/new')}>
          <Plus size={17} />
          Créer un utilisateur
        </button>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">CORE API · COMPTES</span>
            <h2>Comptes utilisateurs</h2>
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
            Site
            <select
              value={site}
              onChange={(event) => changeFilter(setSite, event.target.value)}
              disabled={Boolean(organization) && sites.isLoading}
            >
              <option value="">Tous les sites</option>
              {(sites.data ?? []).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Département
            <select
              value={department}
              onChange={(event) => changeFilter(setDepartment, event.target.value)}
              disabled={Boolean(organization) && departments.isLoading}
            >
              <option value="">Tous les départements</option>
              {(departments.data ?? []).map((item) => (
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
          headers={['Utilisateur', 'Organisation', 'Site', 'Département', 'Rôles', 'Statut']}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun utilisateur disponible."
          rows={users.map((user) => [
            <>
              <b>{fullName(user) || user.email}</b>
              <small>{user.email}</small>
            </>,
            organizations.data?.find((item) => item.id === user.organization)?.name ??
              'Indisponible',
            sites.data?.find((item) => item.id === user.site)?.name ?? 'Non assigné',
            departments.data?.find((item) => item.id === user.department)?.name ?? 'Non assigné',
            <span className="chips">
              {user.roles.length === 0 && <span className="muted-value">Aucun rôle</span>}
              {user.roles.slice(0, 3).map((roleId) => (
                <span className="chip" key={roleId}>
                  {roles.data?.find((role) => role.id === roleId)?.name ?? 'Rôle'}
                </span>
              ))}
              {user.roles.length > 3 && <span className="chip chip--plain">+{user.roles.length - 3}</span>}
            </span>,
            <Status value={user.status} isActive={user.is_active} />,
          ])}
          rowActions={(index) => {
            const user = users[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir ${fullName(user) || user.email}`}
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="row-action"
                  aria-label={`Modifier ${fullName(user) || user.email}`}
                  onClick={() => navigate(`/users/${user.id}/edit`)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="row-action row-action--danger"
                  aria-label={`Supprimer ${fullName(user) || user.email}`}
                  onClick={() => remove(user.id, fullName(user) || user.email)}
                  disabled={deletion.isPending}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} utilisateur(s)</span>
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

function fullName(user: Pick<User, 'first_name' | 'last_name'>) {
  return `${user.first_name} ${user.last_name}`.trim();
}

function Status({ value, isActive }: { value: string; isActive: boolean }) {
  const label =
    value === 'active' ? (isActive ? 'Actif' : 'Inactif') : value === 'inactive' ? 'Inactif' : 'Suspendu';
  return (
    <span className={`status status--${value}`}>
      <i />
      {label}
    </span>
  );
}