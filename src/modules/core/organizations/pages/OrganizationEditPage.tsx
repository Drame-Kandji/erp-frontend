import { useNavigate, useParams } from "react-router-dom";
import { OrganizationForm } from "../components/OrganizationForm";
import {
  useOrganizationQuery,
  useUpdateOrganizationMutation,
} from "../hooks/useOrganizationsQuery";

export function OrganizationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useOrganizationQuery(id);
  const mutation = useUpdateOrganizationMutation();
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement de l’organisation…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Organisation introuvable</b>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · ORGANISATIONS</span>
          <h1>Modifier {query.data.name}</h1>
          <p>Modifiez les informations et paramètres de cette organisation.</p>
        </div>
      </div>
      <OrganizationForm
        initialOrganization={query.data}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate(`/organizations/${query.data.id}`)}
        onSubmit={async (payload) => {
          await mutation.mutateAsync({ id: query.data.id, payload });
          navigate(`/organizations/${query.data.id}`);
        }}
      />
    </>
  );
}
