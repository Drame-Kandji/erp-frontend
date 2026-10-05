import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationQuery } from "../../organizations/hooks/useOrganizationsQuery";
import { useDeleteSiteMutation, useSiteQuery } from "../hooks/useSitesQuery";

export function SiteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useSiteQuery(id);
  const organization = useOrganizationQuery(query.data?.organization);
  const deletion = useDeleteSiteMutation();
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du site…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Site introuvable</b>
        <p>Le serveur n’a pas retourné ce site.</p>
      </div>
    );
  const site = query.data;
  const organizationName = organization.isLoading
    ? "Chargement…"
    : (organization.data?.name ?? "Organisation indisponible");
  const remove = async () => {
    if (
      !window.confirm(`Supprimer ${site.name} ? Cette action est irréversible.`)
    )
      return;
    await deletion.mutateAsync(site.id);
    navigate("/sites");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate("/sites")}>
            <ArrowLeft size={15} />
            Sites
          </button>
          <span className="eyebrow">DÉTAIL SITE</span>
          <h1>{site.name}</h1>
          <p>{site.address || "Aucune adresse renseignée."}</p>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(`/sites/${site.id}/edit`)}
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
          <DetailRow label="Code" value={site.code} />
          <DetailRow label="Organisation" value={organizationName} />
          <DetailRow
            label="Statut"
            value={
              site.status === "active"
                ? "Actif"
                : site.status === "inactive"
                  ? "Inactif"
                  : "Suspendu"
            }
          />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">GÉOLOCALISATION</span>
          <DetailRow
            label="Latitude"
            value={site.latitude ?? "Non renseignée"}
          />
          <DetailRow
            label="Longitude"
            value={site.longitude ?? "Non renseignée"}
          />
          <DetailRow label="Adresse" value={site.address || "Non renseignée"} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">HISTORIQUE</span>
          <DetailRow label="Créé le" value={formatDate(site.created_at)} />
          <DetailRow
            label="Dernière modification"
            value={formatDate(site.updated_at)}
          />
        </section>
      </div>
    </>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
