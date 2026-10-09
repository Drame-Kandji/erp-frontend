import { useNavigate } from "react-router-dom";
import { useOrganizationsQuery } from "../../organizations/hooks/useOrganizationsQuery";
import { DepartmentForm } from "../components/DepartmentForm";
import { useCreateDepartmentMutation } from "../hooks/useDepartmentsQuery";

export function DepartmentCreatePage() {
  const navigate = useNavigate();
  const organizations = useOrganizationsQuery(1);
  const mutation = useCreateDepartmentMutation();
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
        <p>Le département doit être rattaché à une organisation existante.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · DÉPARTEMENTS</span>
          <h1>Nouveau département</h1>
          <p>Créez une unité interne rattachée à une organisation.</p>
        </div>
      </div>
      <DepartmentForm
        organizations={organizations.data?.results ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate("/departments")}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
          navigate("/departments");
        }}
      />
    </>
  );
}