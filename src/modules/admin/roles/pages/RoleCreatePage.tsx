import { useNavigate } from 'react-router-dom'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { RoleForm } from '../components/RoleForm'
import { useCreateRoleMutation } from '../hooks/useRolesQuery'

export function RoleCreatePage() {
  const navigate = useNavigate();
  const organizations = useOrganizationsLookupQuery();
  const mutation = useCreateRoleMutation();
  if (organizations.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement des organisations…</p>
      </div>
    );
  if (organizations.isError)
    return (
      <div className="state-box">
        <b>Impossible de charger les organisations</b>
        <p>Le rôle doit être rattaché à une organisation existante.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · RÔLES</span>
          <h1>Nouveau rôle</h1>
          <p>
            Créez un profil métier avec ses permissions et ses utilisateurs.
          </p>
        </div>
      </div>
      <RoleForm
        organizations={organizations.data ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate('/roles')}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
          navigate('/roles');
        }}
      />
    </>
  );
}