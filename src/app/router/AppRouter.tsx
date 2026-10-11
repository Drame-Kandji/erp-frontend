import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CircleHelp, FileText, Settings2 } from "lucide-react";
import { AppShell } from "../../shared/components/layout/AppShell";
import { LoginPage } from "../../modules/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../../modules/dashboard/pages/DashboardPage";
import { OrganizationsPage } from "../../modules/core/organizations/pages/OrganizationsPage";
import { SitesPage } from "../../modules/core/sites/pages/SitesPage";
import { ComingSoonPage } from "../../shared/components/ComingSoonPage";
import { ProfilePage } from "../../modules/profile/pages/ProfilePage";
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
import { LandingPage } from "../../modules/landing/pages/LandingPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route element={<ProtectedRoute roles={["SUPERADMIN", "ADMIN"]} />}>
              <Route path="organizations" element={<OrganizationsPage />} />
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
            <Route element={<ProtectedRoute roles={["SUPERADMIN"]} />}>
              <Route
                path="organizations/new"
                element={<OrganizationCreatePage />}
              />
            </Route>
            <Route
              element={<ProtectedRoute roles={["SUPERADMIN", "ADMIN", "RH"]} />}
            >
              <Route path="employees" element={<EmployeesPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={["SUPERADMIN", "ADMIN"]} />}>
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
                  <ComingSoonPage
                    label="RESSOURCES HUMAINES"
                    title="Contrats & documents"
                    description="Centralisez les contrats, avenants et pièces administratives."
                    icon={FileText}
                    features={[
                      {
                        title: "Génération de contrats",
                        description:
                          "Modèles de contrats CDI, CDD et chantier pré-remplis.",
                      },
                      {
                        title: "Coffre-fort documentaire",
                        description:
                          "Stockage sécurisé et versionné des pièces du dossier.",
                      },
                      {
                        title: "Alertes d'échéances",
                        description:
                          "Notifications sur les fins de contrat et visites médicales.",
                      },
                    ]}
                  />
                }
              />
            </Route>
            <Route element={<ProtectedRoute roles={["RH", "EMPLOYEE"]} />}>
              <Route path="timesheets" element={<AttendancePage timesheet />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="settings"
              element={
                <ComingSoonPage
                  label="SYSTÈME"
                  title="Paramètres"
                  description="Configurez les préférences globales de votre organisation."
                  icon={Settings2}
                  features={[
                    {
                      title: "Identité visuelle",
                      description:
                        "Logo, couleurs et modèles de documents de l'entreprise.",
                    },
                    {
                      title: "Paramètres régionaux",
                      description:
                        "Fuseau horaire, devise, langue et formats de date.",
                    },
                    {
                      title: "Notifications & intégrations",
                      description:
                        "Webhooks, e-mails automatiques et exports planifiés.",
                    },
                  ]}
                />
              }
            />
            <Route
              path="help"
              element={
                <ComingSoonPage
                  label="ASSISTANCE"
                  title="Centre d'aide"
                  description="Ressources, guides et support pour tirer le meilleur de NOLI CORE."
                  icon={CircleHelp}
                  features={[
                    {
                      title: "Guides par module",
                      description:
                        "Pas-à-pas illustrés pour chaque fonctionnalité.",
                    },
                    {
                      title: "Foire aux questions",
                      description:
                        "Réponses rapides aux questions les plus fréquentes.",
                    },
                    {
                      title: "Contacter le support",
                      description:
                        "Ouvrez un ticket et suivez son traitement en direct.",
                    },
                  ]}
                />
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
