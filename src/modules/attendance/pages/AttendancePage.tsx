import { ChevronDown, MapPin, Search } from "lucide-react";
import { DataTable } from "../../../shared/components/DataTable";
import { useAttendanceQuery } from "../hooks/useAttendanceQuery";

export function AttendancePage({ timesheet = false }: { timesheet?: boolean }) {
  const query = useAttendanceQuery();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {timesheet ? "TIMESHEETS" : "PRÉSENCE"} · MODE DÉMO
          </span>
          <h1>{timesheet ? "Timesheets" : "Présences du jour"}</h1>
          <p>
            {timesheet
              ? "Suivez les heures validées par les équipes."
              : "Contrôlez les arrivées et la présence sur les sites."}
          </p>
        </div>
        {!timesheet && (
          <button className="primary-button">
            <MapPin size={17} />
            Scanner un site
          </button>
        )}
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">POINTAGE</span>
            <h2>
              {timesheet ? "Synthèse des heures" : "Registre des pointages"}
            </h2>
            <p>
              Les données sont simulées jusqu’à la disponibilité de l’API
              Pointage.
            </p>
          </div>
          <div className="table-tools">
            <button className="icon-button" aria-label="Rechercher">
              <Search size={17} />
            </button>
            <button className="filter-button">
              Aujourd’hui <ChevronDown size={15} />
            </button>
          </div>
        </div>
        <DataTable
          headers={[
            "Collaborateur",
            "Site",
            "Arrivée",
            "Départ",
            "Durée",
            "Statut",
          ]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun pointage disponible."
          rows={(query.data ?? []).map((record) => [
            record.employee,
            record.site,
            record.checkIn,
            record.checkOut ?? "En cours",
            record.duration,
            <span
              className={`status status--${record.status === "present" ? "active" : "suspended"}`}
            >
              <i />
              {record.status === "present" ? "Présent" : "En retard"}
            </span>,
          ])}
        />
      </section>
    </>
  );
}
