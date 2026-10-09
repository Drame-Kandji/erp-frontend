import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationsQuery } from "../../organizations/hooks/useOrganizationsQuery";
import { DepartmentForm } from "../components/DepartmentForm";
import {
  useDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../hooks/useDepartmentsQuery";

export function DepartmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = useDepartmentQuery(id);
  const organizations = useOrganizationsQuery(1);
  const mutation = useUpdateDepartmentMutation();
  if (department.isLoading || organizations.isLoading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement du département…</p>
      </div>
    );
  if (department.isError || !department.data || organizations.isError)
    return (
      <div className="state-box">
        <b>Département introuvable</b>
        <p>Le serveur n’a pas retourné ce département ou ses organisations.</p>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · DÉPARTEMENTS</span>
          <h1>Modifier {department.data.name}</h1>
          <p>Mettez à jour le nom, le code et la description du département.</p>
        </div>
      </div>
      <DepartmentForm
        initialDepartment={department.data}
        organizations={organizations.data?.results ?? []}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
        onCancel={() => navigate(`/departments/${department.data.id}`)}
        onSubmit={async (payload) => {
          await mutation.mutateAsync({ id: department.data.id, payload });
          navigate(`/departments/${department.data.id}`);
        }}
      />
    </>
  );
}