import { useNavigate } from 'react-router-dom'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import type { UserCreatePayload } from '../domain/user'
import { UserForm } from '../components/UserForm'
import { useCreateUserMutation } from '../hooks/useUsersQuery'

export function UserCreatePage() {
  const navigate = useNavigate();
  const organizations = useOrganizationsLookupQuery();
  const mutation = useCreateUserMutation();
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
        <p>Le compte doit être rattaché à une organisation existante.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · UTILISATEURS</span>
          <h1>Nouvel utilisateur</h1>
          <p>
            Créez un compte avec mot de passe, rattachement tenant et rôles.
          </p>
        </div>
      </div>
      <UserForm
        createMode
        organizations={organizations.data ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate('/users')}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload as UserCreatePayload);
          navigate('/users');
        }}
      />
    </>
  );
}