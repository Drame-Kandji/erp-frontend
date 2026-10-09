import { useNavigate, useParams } from 'react-router-dom'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import { RoleForm } from '../components/RoleForm'
import { useRoleQuery, useUpdateRoleMutation } from '../hooks/useRolesQuery'

export function RoleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useRoleQuery(id);
  const organizations = useOrganizationsLookupQuery();
  const mutation = useUpdateRoleMutation();
  if (role.isLoading || organizations.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du rôle…</p>
      </div>
    );
  if (role.isError || !role.data || organizations.isError)
    return (
      <div className="state-box">
        <b>Rôle introuvable</b>
        <p>Le serveur n’a pas retourné ce rôle ou ses organisations.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · RÔLES</span>
          <h1>Modifier {role.data.name}</h1>
          <p>Mettez à jour le périmètre de permissions de ce rôle.</p>
        </div>
      </div>
      <RoleForm
        initialRole={role.data}
        organizations={organizations.data ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate(`/roles/${role.data.id}`)}
        onSubmit={async (payload) => {
          await mutation.mutateAsync({ id: role.data.id, payload });
          navigate(`/roles/${role.data.id}`);
        }}
      />
    </>
  );
}