import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  FileText,
  LogIn,
  LogOut,
  MapPin,
  Network,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../../shared/stores/auth.store";
import { useOrganizationsQuery } from "../../core/organizations/hooks/useOrganizationsQuery";
import { useSitesQuery } from "../../core/sites/hooks/useSitesQuery";
import { useDepartmentsQuery } from "../../core/departments/hooks/useDepartmentsQuery";
import { useUsersQuery } from "../../admin/users/hooks/useUsersQuery";
import { useAuditLogsQuery } from "../../admin/audit/hooks/useAuditQuery";

type Stat = {
  label: string;
  value: string;
  icon: typeof Activity;
  tone: string;
  hint?: string;
};

const formatCount = (value: number | undefined) =>
  typeof value === "number" ? value.toLocaleString("fr-FR") : "—";

function actionMeta(action: string) {
  switch (action) {
    case "CREATE":
      return { icon: Plus, title: "Création" };
    case "UPDATE":
      return { icon: Pencil, title: "Modification" };
    case "DELETE":
      return { icon: Trash2, title: "Suppression" };
    case "LOGIN":
      return { icon: LogIn, title: "Connexion" };
    case "LOGOUT":
      return { icon: LogOut, title: "Déconnexion" };
    case "ROLE_ASSIGNED":
      return { icon: ShieldCheck, title: "Rôle attribué" };
    case "ROLE_REMOVED":
      return { icon: ShieldCheck, title: "Rôle retiré" };
    case "PERMISSION_CHANGED":
      return { icon: ShieldCheck, title: "Permission modifiée" };
    default:
      return { icon: Activity, title: action };
  }
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)!;
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  const organizations = useOrganizationsQuery(1, isAdmin);
  const sites = useSitesQuery({ page: 1 }, isAdmin);
  const departments = useDepartmentsQuery({ page: 1 }, isAdmin);
  const users = useUsersQuery({ page: 1 }, isAdmin);
  const recentLogs = useAuditLogsQuery({ page: 1 }, isAdmin);

  const stats: Stat[] = isAdmin
    ? [
        {
          label: "Organisations",
          value: formatCount(organizations.data?.count),
          icon: Building2,
          tone: "green",
          hint: "Périmètre géré",
        },
        {
          label: "Sites",
          value: formatCount(sites.data?.count),
          icon: MapPin,
          tone: "gold",
          hint: "Sites référencés",
        },
        {
          label: "Départements",
          value: formatCount(departments.data?.count),
          icon: Network,
          tone: "blue",
          hint: "Structures internes",
        },
        {
          label: "Utilisateurs",
          value: formatCount(users.data?.count),
          icon: Users,
          tone: "rose",
          hint: "Comptes de l’organisation",
        },
      ]
    : user.role === "RH"
      ? [
          {
            label: "Employés actifs",
            value: "178",
            icon: Users,
            tone: "green",
            hint: "Effectif en poste",
          },
          {
            label: "Contrats actifs",
            value: "164",
            icon: FileText,
            tone: "gold",
            hint: "Contrats en cours",
          },
          {
            label: "Présences aujourd'hui",
            value: "152",
            icon: ClipboardCheck,
            tone: "blue",
            hint: "Pointages du jour",
          },
          {
            label: "Absences",
            value: "12",
            icon: Clock3,
            tone: "rose",
            hint: "À traiter",
          },
        ]
    : [
        {
          label: "Temps aujourd'hui",
          value: "06h42",
          icon: Clock3,
          tone: "green",
        },
        {
          label: "Ce mois",
          value: "142h",
          icon: CheckCircle2,
          tone: "gold",
        },
      ];

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {user.role === "EMPLOYEE" ? "MON ESPACE" : "VUE D’ENSEMBLE"}
          </span>
          <h1>Bonjour, {user.name.split(" ")[0]}</h1>
          <p>
            {user.role === "ADMIN" || user.role === "SUPERADMIN"
              ? "Une vision claire de votre périmètre opérationnel."
              : user.role === "RH"
                ? "Pilotez les équipes et la présence au quotidien."
                : "Retrouvez vos activités et votre temps de travail."}
          </p>
        </div>
      </div>
      <div className={`kpi-grid kpi-grid--${stats.length}`}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="kpi-card" key={stat.label}>
              <div className={`kpi-icon ${stat.tone}`}>
                <Icon size={19} />
              </div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.hint && <small>{stat.hint}</small>}
            </div>
          );
        })}
      </div>
      <div className="dashboard-grid">
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SUIVI</span>
              <h2>Activité récente</h2>
            </div>
          </div>
          {isAdmin ? (
            <div className="activity-list">
              {recentLogs.isLoading && (
                <div className="state-box">
                  <span className="spinner" />
                </div>
              )}
              {recentLogs.data?.results.slice(0, 4).map((log) => {
                const meta = actionMeta(log.action);
                return (
                  <ActivityRow
                    key={log.id}
                    icon={meta.icon}
                    title={meta.title}
                    detail={[
                      log.resource_repr || log.resource_type,
                      log.actor_email,
                    ]
                      .filter(
                        (part, index, parts) =>
                          Boolean(part) && parts.indexOf(part) === index,
                      )
                      .join(" · ")}
                    time={new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(log.timestamp))}
                  />
                );
              })}
              {recentLogs.data && recentLogs.data.results.length === 0 && (
                <div className="state-box">
                  <b>Aucune activité récente</b>
                  <p>Les événements d’audit s’afficheront ici.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="activity-list">
              <ActivityRow
                icon={Building2}
                title="Organisation mise à jour"
                detail="NOLI CORE · Configuration"
                time="Il y a 18 min"
              />
              <ActivityRow
                icon={MapPin}
                title="Nouveau site ajouté"
                detail="Site Thiès · THS"
                time="Il y a 1 h"
              />
              <ActivityRow
                icon={CheckCircle2}
                title="Synchronisation terminée"
                detail="Données prêtes pour votre rôle"
                time="Hier, 16:42"
              />
            </div>
          )}
        </section>
        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ÉTAT DU SYSTÈME</span>
              <h2>Services de la V1</h2>
            </div>
          </div>
          <ServiceRow label="CORE API" state="Prêt" />
          <ServiceRow label="RH" state="Mode démonstration" />
          <ServiceRow label="Pointage" state="Mode démonstration" />
        </section>
      </div>
    </>
  );
}
function ActivityRow({
  icon: Icon,
  title,
  detail,
  time,
}: {
  icon: typeof Activity;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="activity-row">
      <div className="activity-icon">
        <Icon size={16} />
      </div>
      <div>
        <b>{title}</b>
        <small>{detail}</small>
      </div>
      <time>{time}</time>
    </div>
  );
}
function ServiceRow({ label, state }: { label: string; state: string }) {
  return (
    <div className="service-row">
      <span className="pulse" />
      <span>
        <b>{label}</b>
        <small>{state}</small>
      </span>
    </div>
  );
}
