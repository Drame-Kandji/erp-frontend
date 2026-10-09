import { Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../../shared/components/DataTable";
import { useAuditLogsQuery } from "../hooks/useAuditQuery";

export function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const navigate = useNavigate();
  const query = useAuditLogsQuery({
    page,
    action: action || undefined,
    resource_type: resourceType || undefined,
    success: success === "" ? undefined : success === "true",
    search: search || undefined,
    date_from: dateFrom ? `${dateFrom}T00:00:00` : undefined,
    date_to: dateTo ? `${dateTo}T23:59:59` : undefined,
  });
  const pageCount = Math.max(1, Math.ceil((query.data?.count ?? 0) / 20));
  const changeFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>Journal d’audit</h1>
          <p>
            Consultez l’historique des actions sensibles de votre organisation.
          </p>
        </div>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">
              CORE API ·{" "}
              {import.meta.env.VITE_DATA_SOURCE === "mock"
                ? "MODE DÉMO"
                : "CONNECTÉE"}
            </span>
            <h2>Événements de sécurité</h2>
          </div>
        </div>
        <div className="resource-filters">
          <label>
            Recherche
            <input
              value={search}
              placeholder="Ressource ou type"
              onChange={(event) => setSearch(event.target.value)}
              onBlur={() => setPage(1)}
            />
          </label>
          <label>
            Action
            <select
              value={action}
              onChange={(event) =>
                changeFilter(setAction, event.target.value)
              }
            >
              <option value="">Toutes les actions</option>
              {auditActions.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ressource
            <input
              value={resourceType}
              placeholder="Ex. Site, User"
              onChange={(event) =>
                changeFilter(setResourceType, event.target.value)
              }
            />
          </label>
          <label>
            Statut
            <select
              value={success}
              onChange={(event) =>
                changeFilter(setSuccess, event.target.value)
              }
            >
              <option value="">Tous</option>
              <option value="true">Succès</option>
              <option value="false">Échec</option>
            </select>
          </label>
          <label>
            Du
            <input
              type="date"
              value={dateFrom}
              onChange={(event) =>
                changeFilter(setDateFrom, event.target.value)
              }
            />
          </label>
          <label>
            Au
            <input
              type="date"
              value={dateTo}
              onChange={(event) => changeFilter(setDateTo, event.target.value)}
            />
          </label>
        </div>
        <DataTable
          headers={["Action", "Ressource", "Acteur", "Statut", "Date"]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun événement d’audit disponible."
          rows={(query.data?.results ?? []).map((log) => [
            <ActionBadge action={log.action} />,
            <>
              <b>{log.resource_repr || log.resource_type}</b>
              <small>
                {log.resource_type} · {log.method}
              </small>
            </>,
            log.actor_email ?? "Système",
            <AuditStatus success={log.success} code={log.status_code} />,
            <AuditDate value={log.timestamp} />,
          ])}
          rowActions={(index) => {
            const log = (query.data?.results ?? [])[index];
            return (
              <div className="row-actions">
                <button
                  className="row-action"
                  aria-label={`Voir l’événement ${log.id}`}
                  onClick={() => navigate(`/audit/${log.id}`)}
                >
                  <Eye size={15} />
                </button>
              </div>
            );
          }}
        />
        <div className="pagination">
          <span>{query.data?.count ?? 0} événement(s)</span>
          <div>
            <button
              className="secondary-button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Précédent
            </button>
            <strong>
              Page {page} / {pageCount}
            </strong>
            <button
              className="secondary-button"
              disabled={page >= pageCount}
              onClick={() => setPage((current) => current + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

const auditActions = [
  { value: "CREATE", label: "Création" },
  { value: "UPDATE", label: "Modification" },
  { value: "DELETE", label: "Suppression" },
  { value: "LOGIN", label: "Connexion" },
  { value: "LOGOUT", label: "Déconnexion" },
  { value: "ROLE_ASSIGNED", label: "Rôle attribué" },
  { value: "ROLE_REMOVED", label: "Rôle retiré" },
  { value: "PERMISSION_CHANGED", label: "Permission modifiée" },
];

function actionLabel(action: string) {
  return (
    auditActions.find((item) => item.value === action)?.label ?? action
  );
}

export function ActionBadge({ action }: { action: string }) {
  return (
    <span className={`audit-action audit-action--${action.toLowerCase()}`}>
      {actionLabel(action)}
    </span>
  );
}

export function AuditStatus({
  success,
  code,
}: {
  success: boolean;
  code: number | null;
}) {
  return (
    <span className={`status status--${success ? "success" : "failed"}`}>
      <i />
      {success ? "Succès" : "Échec"}
      {code ? ` · ${code}` : ""}
    </span>
  );
}

export function AuditDate({ value }: { value: string }) {
  return (
    <span>
      {new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))}
    </span>
  );
}