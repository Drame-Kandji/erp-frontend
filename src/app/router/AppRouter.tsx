import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../../shared/components/layout/AppShell";
import { LoginPage } from "../../modules/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../../modules/dashboard/pages/DashboardPage";
import { OrganizationsPage } from "../../modules/core/organizations/pages/OrganizationsPage";
import { SitesPage } from "../../modules/core/sites/pages/SitesPage";
import { ModulePlaceholderPage } from "../../shared/components/ModulePlaceholderPage";
import { EmployeesPage } from "../../modules/hr/pages/EmployeesPage";
import { AttendancePage } from "../../modules/attendance/pages/AttendancePage";
import { UsersPage } from "../../modules/admin/users/pages/UsersPage";
import { UserCreatePage } from "../../modules/admin/users/pages/UserCreatePage";
import { UserDetailPage } from "../../modules/admin/users/pages/UserDetailPage";
import { UserEditPage } from "../../modules/admin/users/pages/UserEditPage";
import { RolesPage } from "../../modules/admin/roles/pages/RolesPage";
import { RoleCreatePage } from "../../modules/admin/roles/pages/RoleCreatePage";
import { RoleDetailPage } from "../../modules/admin/roles/pages/RoleDetailPage";
import { RoleEditPage } from "../../modules/admin/roles/pages/RoleEditPage";
import { OrganizationCreatePage } from "../../modules/core/organizations/pages/OrganizationCreatePage";
import { OrganizationDetailPage } from "../../modules/core/organizations/pages/OrganizationDetailPage";
import { OrganizationEditPage } from "../../modules/core/organizations/pages/OrganizationEditPage";
import { SiteCreatePage } from "../../modules/core/sites/pages/SiteCreatePage";
import { SiteDetailPage } from "../../modules/core/sites/pages/SiteDetailPage";
import { SiteEditPage } from "../../modules/core/sites/pages/SiteEditPage";
import { DepartmentsPage } from "../../modules/core/departments/pages/DepartmentsPage";
import { DepartmentCreatePage } from "../../modules/core/departments/pages/DepartmentCreatePage";
import { DepartmentDetailPage } from "../../modules/core/departments/pages/DepartmentDetailPage";
import { DepartmentEditPage } from "../../modules/core/departments/pages/DepartmentEditPage";
import { AuditLogsPage } from "../../modules/admin/audit/pages/AuditLogsPage";
import { AuditDetailPage } from "../../modules/admin/audit/pages/AuditDetailPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route
                path="organizations/new"
                element={<OrganizationCreatePage />}
              />
              <Route
                path="organizations/:id/edit"
                element={<OrganizationEditPage />}
              />
              <Route
                path="organizations/:id"
                element={<OrganizationDetailPage />}
              />
              <Route path="sites" element={<SitesPage />} />
              <Route path="sites/new" element={<SiteCreatePage />} />
              <Route path="sites/:id/edit" element={<SiteEditPage />} />
              <Route path="sites/:id" element={<SiteDetailPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/new" element={<DepartmentCreatePage />} />
              <Route
                path="departments/:id/edit"
                element={<DepartmentEditPage />}
              />
              <Route path="departments/:id" element={<DepartmentDetailPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["ADMIN", "RH"]} />}>
              <Route path="employees" element={<EmployeesPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="users/new" element={<UserCreatePage />} />
              <Route path="users/:id/edit" element={<UserEditPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="roles/new" element={<RoleCreatePage />} />
              <Route path="roles/:id/edit" element={<RoleEditPage />} />
              <Route path="roles/:id" element={<RoleDetailPage />} />
              <Route path="audit" element={<AuditLogsPage />} />
              <Route path="audit/:id" element={<AuditDetailPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["RH"]} />}>
              <Route path="attendance" element={<AttendancePage />} />
              <Route
                path="contracts"
                element={
                  <ModulePlaceholderPage
                    title="Contrats & documents"
                    label="RESSOURCES HUMAINES"
                  />
                }
              />
            </Route>
            <Route element={<ProtectedRoute roles={["RH", "EMPLOYEE"]} />}>
              <Route path="timesheets" element={<AttendancePage timesheet />} />
            </Route>
            <Route
              path="profile"
              element={
                <ModulePlaceholderPage
                  title="Mon profil"
                  label="ESPACE PERSONNEL"
                />
              }
            />
            <Route
              path="settings"
              element={
                <ModulePlaceholderPage title="Paramètres" label="SYSTÈME" />
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
