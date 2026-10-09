import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationQuery } from "../../organizations/hooks/useOrganizationsQuery";
import {
  useDeleteDepartmentMutation,
  useDepartmentQuery,
} from "../hooks/useDepartmentsQuery";

export function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useDepartmentQuery(id);
  const organization = useOrganizationQuery(query.data?.organization);
  const deletion = useDeleteDepartmentMutation();
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du département…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Département introuvable</b>
        <p>Le serveur n’a pas retourné ce département.</p>
      </div>
    );
  const department = query.data;
  const organizationName = organization.isLoading
    ? "Chargement…"
    : (organization.data?.name ?? "Organisation indisponible");
  const remove = async () => {
    if (
      !window.confirm(
        `Supprimer ${department.name} ? Cette action est irréversible.`,
      )
    )
      return;
    await deletion.mutateAsync(department.id);
    navigate("/departments");
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate("/departments")}>
            <ArrowLeft size={15} />
            Départements
          </button>
          <span className="eyebrow">DÉTAIL DÉPARTEMENT</span>
          <h1>{department.name}</h1>
          <p>{department.description || "Aucune description renseignée."}</p>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(`/departments/${department.id}/edit`)}
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
          <DetailRow label="Code" value={department.code} />
          <DetailRow label="Organisation" value={organizationName} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">DESCRIPTION</span>
          <DetailRow
            label="Description"
            value={department.description || "Non renseignée"}
          />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">HISTORIQUE</span>
          <DetailRow label="Créé le" value={formatDate(department.created_at)} />
          <DetailRow
            label="Dernière modification"
            value={formatDate(department.updated_at)}
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