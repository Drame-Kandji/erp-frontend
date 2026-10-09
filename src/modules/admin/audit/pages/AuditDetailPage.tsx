import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuditLogQuery } from "../hooks/useAuditQuery";
import { ActionBadge, AuditStatus } from "./AuditLogsPage";

export function AuditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useAuditLogQuery(id);
  if (query.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement de l’événement…</p>
      </div>
    );
  if (query.isError || !query.data)
    return (
      <div className="state-box">
        <b>Événement introuvable</b>
        <p>Le serveur n’a pas retourné cet événement d’audit.</p>
      </div>
    );
  const log = query.data;
  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate("/audit")}>
            <ArrowLeft size={15} />
            Journal d’audit
          </button>
          <span className="eyebrow">DÉTAIL ÉVÉNEMENT</span>
          <h1>{log.resource_repr || log.resource_type}</h1>
          <p>
            {log.resource_type} · {log.method} {log.path}
          </p>
        </div>
        <div className="heading-actions">
          <ActionBadge action={log.action} />
          <AuditStatus success={log.success} code={log.status_code} />
        </div>
      </div>
      <div className="detail-grid">
        <section className="panel detail-card">
          <span className="eyebrow">ÉVÉNEMENT</span>
          <DetailRow label="Action" value={log.action} />
          <DetailRow label="Type de ressource" value={log.resource_type} />
          <DetailRow
            label="Identifiant ressource"
            value={log.resource_id ?? "Non renseigné"}
          />
          <DetailRow label="Méthode" value={log.method} />
          <DetailRow label="Chemin" value={log.path} />
          <DetailRow
            label="Code HTTP"
            value={log.status_code ? String(log.status_code) : "Non renseigné"}
          />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">ACTEUR</span>
          <DetailRow label="Utilisateur" value={log.actor_email ?? "Système"} />
          <DetailRow
            label="Adresse IP"
            value={log.ip_address ?? "Non renseignée"}
          />
          <DetailRow
            label="Request ID"
            value={log.request_id || "Non renseigné"}
          />
          <DetailRow label="User-Agent" value={log.user_agent || "Non renseigné"} />
        </section>
        <section className="panel detail-card">
          <span className="eyebrow">HORODATAGE</span>
          <DetailRow label="Horodatage" value={formatDate(log.timestamp)} />
          <DetailRow label="Organisation" value={log.organization} />
        </section>
      </div>
      <section className="panel detail-card">
        <span className="eyebrow">CHANGEMENTS</span>
        <JsonBlock value={log.changes} empty="Aucun changement enregistré." />
      </section>
      <section className="panel detail-card">
        <span className="eyebrow">MÉTADONNÉES</span>
        <JsonBlock
          value={log.metadata}
          empty="Aucune métadonnée complémentaire."
        />
      </section>
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

function JsonBlock({
  value,
  empty = "Aucune donnée.",
}: {
  value: Record<string, unknown> | null;
  empty?: string;
}) {
  if (!value || Object.keys(value).length === 0)
    return <p className="detail-empty">{empty}</p>;
  return <pre className="code-block">{JSON.stringify(value, null, 2)}</pre>;
}