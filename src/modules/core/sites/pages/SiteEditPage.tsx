import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationsQuery } from "../../organizations/hooks/useOrganizationsQuery";
import { SiteForm } from "../components/SiteForm";
import { useSiteQuery, useUpdateSiteMutation } from "../hooks/useSitesQuery";

export function SiteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const site = useSiteQuery(id);
  const organizations = useOrganizationsQuery(1);
  const mutation = useUpdateSiteMutation();
  if (site.isLoading || organizations.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du site…</p>
      </div>
    );
  if (site.isError || !site.data || organizations.isError)
    return (
      <div className="state-box">
        <b>Site introuvable</b>
        <p>Le serveur n’a pas retourné ce site ou ses organisations.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · SITES</span>
          <h1>Modifier {site.data.name}</h1>
          <p>Modifiez les informations du site et ses coordonnées GPS.</p>
        </div>
      </div>
      <SiteForm
        initialSite={site.data}
        organizations={organizations.data?.results ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate(`/sites/${site.data.id}`)}
        onSubmit={async (payload) => {
          await mutation.mutateAsync({ id: site.data.id, payload });
          navigate(`/sites/${site.data.id}`);
        }}
      />
    </>
  );
}
