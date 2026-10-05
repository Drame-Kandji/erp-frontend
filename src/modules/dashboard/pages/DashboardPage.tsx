import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../../shared/stores/auth.store";
import { useOrganizationsQuery } from "../../core/organizations/hooks/useOrganizationsQuery";
import { useSitesQuery } from "../../core/sites/hooks/useSitesQuery";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)!;
  const organizations = useOrganizationsQuery(1);
  const sites = useSitesQuery({ page: 1 });
  const stats =
    user.role === "ADMIN"
      ? [
          {
            label: "Organisations",
            value: organizations.data?.count ?? "—",
            icon: Building2,
            tone: "green",
          },
          {
            label: "Sites actifs",
            value:
              sites.data?.results.filter((site) => site.status === "active")
                .length ?? "—",
            icon: MapPin,
            tone: "gold",
          },
          { label: "Utilisateurs", value: "24", icon: Users, tone: "blue" },
          { label: "Employés", value: "186", icon: Activity, tone: "rose" },
        ]
      : user.role === "RH"
        ? [
            {
              label: "Employés actifs",
              value: "178",
              icon: Users,
              tone: "green",
            },
            {
              label: "Contrats actifs",
              value: "164",
              icon: FileText,
              tone: "gold",
            },
            {
              label: "Présences aujourd'hui",
              value: "152",
              icon: ClipboardCheck,
              tone: "blue",
            },
            { label: "Absences", value: "12", icon: Clock3, tone: "rose" },
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
            {user.role === "ADMIN"
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
              <small>
                <ArrowUpRight size={13} /> 8,4% <em>vs mois dernier</em>
              </small>
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
