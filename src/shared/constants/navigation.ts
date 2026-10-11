import { Activity, Building2, CircleHelp, ClipboardCheck, Clock3, FileText, KeyRound, LayoutDashboard, MapPin, Network, Settings2, ShieldCheck, Users } from 'lucide-react'
import type { NavigationSection } from '../types/navigation'

export const navigation: NavigationSection[] = [
  { label: 'Pilotage', items: [{ label: 'Tableau de bord', route: 'dashboard', icon: LayoutDashboard, roles: ['SUPERADMIN', 'ADMIN', 'RH', 'EMPLOYEE'] }] },
  { label: 'Organisation', items: [{ label: 'Organisations', route: 'organizations', icon: Building2, roles: ['SUPERADMIN', 'ADMIN'] }, { label: 'Sites', route: 'sites', icon: MapPin, roles: ['SUPERADMIN', 'ADMIN'] }, { label: 'Départements', route: 'departments', icon: Network, roles: ['SUPERADMIN', 'ADMIN'] }] },
  { label: 'Administration', items: [{ label: 'Utilisateurs', route: 'users', icon: ShieldCheck, roles: ['SUPERADMIN', 'ADMIN'] }, { label: 'Rôles & permissions', route: 'roles', icon: KeyRound, roles: ['SUPERADMIN', 'ADMIN'] }, { label: "Journal d'audit", route: 'audit', icon: Activity, roles: ['SUPERADMIN', 'ADMIN'] }] },
  { label: 'Ressources humaines', items: [{ label: 'Employés', route: 'employees', icon: Users, roles: ['SUPERADMIN', 'ADMIN', 'RH'] }, { label: 'Contrats & documents', route: 'contracts', icon: FileText, roles: ['RH'] }] },
  { label: 'Présence', items: [{ label: 'Présences', route: 'attendance', icon: ClipboardCheck, roles: ['RH'] }, { label: 'Timesheets', route: 'timesheets', icon: Clock3, roles: ['RH', 'EMPLOYEE'] }] },
  { label: 'Mon espace', items: [{ label: 'Mon profil', route: 'profile', icon: Users, roles: ['SUPERADMIN', 'ADMIN', 'RH', 'EMPLOYEE'] }, { label: 'Paramètres', route: 'settings', icon: Settings2, roles: ['SUPERADMIN', 'ADMIN'] }, { label: "Centre d'aide", route: 'help', icon: CircleHelp, roles: ['SUPERADMIN', 'ADMIN', 'RH', 'EMPLOYEE'] }] },
]