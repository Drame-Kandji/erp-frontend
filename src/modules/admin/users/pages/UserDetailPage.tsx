import { ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDepartmentsLookupQuery } from '../../../core/departments/hooks/useDepartmentsQuery'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { useSitesLookupQuery } from '../../../core/sites/hooks/useSitesQuery'
import { useRolesLookupQuery } from '../../roles/hooks/useRolesQuery'
import type { User } from '../domain/user'
import { useDeleteUserMutation, useUserQuery } from '../hooks/useUsersQuery'

export function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useUserQuery(id);
  const organizations = useOrganizationsLookupQuery();
  const sites = useSitesLookupQuery(query.data?.organization);
  const departments = useDepartmentsLookupQuery(query.data?.organization);
  const roles = useRolesLookupQuery(query.data?.organization);
  const deletion = useDeleteUserMutation();
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement de l’utilisateur…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Utilisateur introuvable</b>
        <p>Le serveur n’a pas retourné ce compte.</p>
      </div>
    );
  const user: User = query.data;
  const userName = fullName(user) || user.email;
  const organizationName =
    organizations.data?.find((item) => item.id === user.organization)?.name ??
    'Organisation indisponible';
  const siteName = sites.data?.find((item) => item.id === user.site)?.name ?? 'Non assigné';
  const departmentName =
    departments.data?.find((item) => item.id === user.department)?.name ?? 'Non assigné';
  const remove = async () => {
    if (!window.confirm(`Supprimer le compte ${userName} ? Cette action est irréversible.`)) return;
    await deletion.mutateAsync(user.id);
    navigate('/users');
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate('/users')}>
            <ArrowLeft size={15} />
            Utilisateurs &amp; rôles
          </button>
          <span className="eyebrow">DÉTAIL UTILISATEUR</span>
          <h1>{userName}</h1>
          <p>{user.email}</p>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(`/users/${user.id}/edit`)}
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
          <DetailRow label="Prénom" value={user.first_name || '—'} />
          <DetailRow label="Nom" value={user.last_name || '—'} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Téléphone" value={user.phone || 'Non renseigné'} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">AFFECTATION</span>
          <DetailRow label="Organisation" value={organizationName} />
          <DetailRow label="Site" value={siteName} />
          <DetailRow label="Département" value={departmentName} />
          <DetailRow label="Identifiant" value={user.id} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">ACCÈS &amp; ÉTAT</span>
          <div className="detail-list">
            <span>Rôles ({user.roles.length})</span>
            <div className="chips">
              {user.roles.length === 0 && <span className="muted-value">Aucun rôle</span>}
              {user.roles.map((roleId) => (
                <span className="chip" key={roleId}>
                  {roles.data?.find((role) => role.id === roleId)?.name ?? 'Rôle indisponible'}
                </span>
              ))}
            </div>
          </div>
          <DetailRow
            label="Statut"
            value={<StatusBadge value={user.status} isActive={user.is_active} />}
          />
          <DetailRow label="Compte actif" value={user.is_active ? 'Oui' : 'Non'} />
          <DetailRow label="Compte staff" value={user.is_staff ? 'Oui' : 'Non'} />
          <DetailRow label="Créé le" value={formatDate(user.created_at)} />
          <DetailRow label="Dernière modification" value={formatDate(user.updated_at)} />
          <DetailRow
            label="Dernière connexion"
            value={user.last_login ? formatDate(user.last_login) : 'Jamais'}
          />
        </section>
      </div>
    </>
  );
}

function fullName(user: Pick<User, 'first_name' | 'last_name'>) {
  return `${user.first_name} ${user.last_name}`.trim();
}

function StatusBadge({ value, isActive }: { value: string; isActive: boolean }) {
  const label =
    value === 'active'
      ? isActive
        ? 'Actif'
        : 'Inactif'
      : value === 'inactive'
        ? 'Inactif'
        : 'Suspendu';
  return (
    <span className={`status status--${value}`}>
      <i />
      {label}
    </span>
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