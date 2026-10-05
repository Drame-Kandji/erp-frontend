import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteOrganizationMutation,
  useOrganizationQuery,
} from "../hooks/useOrganizationsQuery";

export function OrganizationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useOrganizationQuery(id);
  const deletion = useDeleteOrganizationMutation();
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
        <p>Le serveur n’a pas retourné cette organisation.</p>
      </div>
    );
  const organization = query.data;
  const remove = async () => {
    if (
      !window.confirm(
        `Supprimer ${organization.name} ? Cette action est irréversible.`,
      )
    )
      return;
    await deletion.mutateAsync(organization.id);
    navigate("/organizations");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <button
            className="back-link"
            onClick={() => navigate("/organizations")}
          >
            <ArrowLeft size={15} />
            Organisations
          </button>
          <span className="eyebrow">DÉTAIL ORGANISATION</span>
          <h1>{organization.name}</h1>
          <p>{organization.description || "Aucune description renseignée."}</p>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(`/organizations/${organization.id}/edit`)}
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
          <DetailRow label="Code" value={organization.code} />
          <DetailRow
            label="Statut"
            value={
              organization.status === "active"
                ? "Actif"
                : organization.status === "inactive"
                  ? "Inactif"
                  : "Suspendu"
            }
          />
          <DetailRow label="Identifiant" value={organization.id} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">CONFIGURATION</span>
          <DetailRow
            label="Fuseau horaire"
            value={organization.configuration.timezone}
          />
          <DetailRow
            label="Langue"
            value={organization.configuration.language}
          />
          <DetailRow
            label="Devise"
            value={organization.configuration.currency}
          />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">HISTORIQUE</span>
          <DetailRow
            label="Créée le"
            value={formatDate(organization.created_at)}
          />
          <DetailRow
            label="Dernière modification"
            value={formatDate(organization.updated_at)}
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
