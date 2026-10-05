import { ChevronDown, Plus, Search } from "lucide-react";
import { DataTable } from "../../../shared/components/DataTable";
import { useEmployeesQuery } from "../hooks/useEmployeesQuery";

export function EmployeesPage() {
  const query = useEmployeesQuery();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">RESSOURCES HUMAINES · MODE DÉMO</span>
          <h1>Employés</h1>
          <p>La vue RH de l’effectif sous votre responsabilité.</p>
        </div>
        <button className="primary-button">
          <Plus size={17} />
          Ajouter un employé
        </button>
      </div>
      <section className="panel resource-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">REGISTRE RH</span>
            <h2>Effectif de l’organisation</h2>
            <p>
              Le service mocké sera remplacé par l’endpoint employés sans
              modifier cette page.
            </p>
          </div>
          <div className="table-tools">
            <button className="icon-button" aria-label="Rechercher">
              <Search size={17} />
            </button>
            <button className="filter-button">
              Filtres <ChevronDown size={15} />
            </button>
          </div>
        </div>
        <DataTable
          headers={[
            "Employé",
            "Organisation",
            "Site",
            "Département",
            "Poste",
            "Statut",
          ]}
          loading={query.isLoading}
          error={query.isError}
          empty="Aucun employé disponible."
          rows={(query.data ?? []).map((employee) => [
            <>
              <b>{employee.name}</b>
              <small>{employee.employeeNumber}</small>
            </>,
            employee.organization,
            employee.site,
            employee.department,
            employee.position,
            <EmployeeStatus value={employee.status} />,
          ])}
        />
      </section>
    </>
  );
}
function EmployeeStatus({ value }: { value: string }) {
  const labels = { active: "Actif", on_leave: "En congé", inactive: "Inactif" };
  return (
    <span
      className={`status status--${value === "active" ? "active" : "inactive"}`}
    >
      <i />
      {labels[value as keyof typeof labels]}
    </span>
  );
}
