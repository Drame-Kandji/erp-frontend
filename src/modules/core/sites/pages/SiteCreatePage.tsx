import { useNavigate } from "react-router-dom";
import { useOrganizationsQuery } from "../../organizations/hooks/useOrganizationsQuery";
import { SiteForm } from "../components/SiteForm";
import { useCreateSiteMutation } from "../hooks/useSitesQuery";

export function SiteCreatePage() {
  const navigate = useNavigate();
  const organizations = useOrganizationsQuery(1);
  const mutation = useCreateSiteMutation();
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
        <p>Le site doit être rattaché à une organisation existante.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · SITES</span>
          <h1>Nouveau site</h1>
          <p>
            Enregistrez une implantation opérationnelle rattachée à une
            organisation.
          </p>
        </div>
      </div>
      <SiteForm
        organizations={organizations.data?.results ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate("/sites")}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
          navigate("/sites");
        }}
      />
    </>
  );
}
