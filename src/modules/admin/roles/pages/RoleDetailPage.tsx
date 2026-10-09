import { ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { useUsersLookupQuery } from '../../users/hooks/useUsersQuery'
import type { Permission } from '../domain/permission'
import { useAllPermissionsQuery } from '../hooks/usePermissionsQuery'
import { useDeleteRoleMutation, useRoleQuery } from '../hooks/useRolesQuery'

export function RoleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useRoleQuery(id);
  const organizations = useOrganizationsLookupQuery();
  const permissions = useAllPermissionsQuery();
  const users = useUsersLookupQuery();
  const deletion = useDeleteRoleMutation();
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du rôle…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Rôle introuvable</b>
        <p>Le serveur n’a pas retourné ce rôle.</p>
      </div>
    );
  const role = query.data;
  const organizationName =
    organizations.data?.find((item) => item.id === role.organization)?.name ??
    'Organisation indisponible';
  const permissionOf = (permissionId: number) =>
    (permissions.data ?? []).find((permission: Permission) => permission.id === permissionId);
  const userNameOf = (userId: string) => {
    const user = (users.data ?? []).find((item) => item.id === userId);
    if (!user) return 'Utilisateur indisponible';
    return `${user.first_name} ${user.last_name}`.trim() || user.email;
  };
  const remove = async () => {
    if (!window.confirm(`Supprimer le rôle ${role.name} ? Cette action est irréversible.`)) return;
    await deletion.mutateAsync(role.id);
    navigate('/roles');
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate('/roles')}>
            <ArrowLeft size={15} />
            Rôles &amp; permissions
          </button>
          <span className="eyebrow">DÉTAIL RÔLE</span>
          <h1>{role.name}</h1>
          <p>{role.description || 'Aucune description renseignée.'}</p>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(`/roles/${role.id}/edit`)}
          >
            <Edit3 size={16} />
            Modifier
          </button>
          <button
            className="danger-button"
            onClick={remove}
            disabled={deletion.isPending}
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <section className="panel detail-card">
          <span className="eyebrow">IDENTITÉ</span>
          <DetailRow label="Code" value={<span className="role-badge">{role.code}</span>} />
          <DetailRow label="Organisation" value={organizationName} />
          <DetailRow label="Identifiant" value={role.id} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">PERMISSIONS</span>
          <div className="detail-list">
            <span>{role.permissions.length} permission(s) accordée(s)</span>
            <div className="chips">
              {role.permissions.length === 0 && <span className="muted-value">Aucune permission</span>}
              {role.permissions.map((permissionId) => {
                const permission = permissionOf(permissionId);
                return (
                  <span className="chip chip--gold" key={permissionId} title={permission?.name}>
                    {permission?.permission_code ?? `#${permissionId}`}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">TITULAIRES</span>
          <div className="detail-list">
            <span>{role.users.length} utilisateur(s) assigné(s)</span>
            <div className="chips">
              {role.users.length === 0 && <span className="muted-value">Aucun utilisateur</span>}
              {role.users.map((userId) => (
                <span className="chip" key={userId}>
                  {userNameOf(userId)}
                </span>
              ))}
            </div>
          </div>
          <DetailRow label="Créé le" value={formatDate(role.created_at)} />
          <DetailRow label="Dernière modification" value={formatDate(role.updated_at)} />
        </section>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}