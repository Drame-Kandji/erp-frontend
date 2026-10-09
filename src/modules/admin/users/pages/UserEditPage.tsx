import { useNavigate, useParams } from 'react-router-dom'
import { useOrganizationsLookupQuery } from '../../../core/organizations/hooks/useOrganizationsQuery'
import type { UserPayload } from '../domain/user'
import { UserForm } from '../components/UserForm'
import { useUpdateUserMutation, useUserQuery } from '../hooks/useUsersQuery'

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserQuery(id);
  const organizations = useOrganizationsLookupQuery();
  const mutation = useUpdateUserMutation();
  if (user.isLoading || organizations.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement de l’utilisateur…</p>
      </div>
    );
  if (user.isError || !user.data || organizations.isError)
    return (
      <div className="state-box">
        <b>Utilisateur introuvable</b>
        <p>Le serveur n’a pas retourné ce compte ou ses organisations.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · UTILISATEURS</span>
          <h1>Modifier {user.data.email}</h1>
          <p>Mettez à jour le profil et le rattachement de ce compte.</p>
        </div>
      </div>
      <UserForm
        initialUser={user.data}
        organizations={organizations.data ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate(`/users/${user.data.id}`)}
        onSubmit={async (payload) => {
          await mutation.mutateAsync({ id: user.data.id, payload: payload as UserPayload });
          navigate(`/users/${user.data.id}`);
        }}
      />
    </>
  );
}