import { useNavigate } from "react-router-dom";
import { OrganizationForm } from "../components/OrganizationForm";
import { useCreateOrganizationMutation } from "../hooks/useOrganizationsQuery";

export function OrganizationCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateOrganizationMutation();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · ORGANISATIONS</span>
          <h1>Nouvelle organisation</h1>
          <p>Créez une nouvelle organisation cliente dans le tenant ERP.</p>
        </div>
      </div>
      <OrganizationForm
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate("/organizations")}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
          navigate("/organizations");
        }}
      />
    </>
  );
}
