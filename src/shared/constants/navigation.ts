import { Activity, Building2, ClipboardCheck, Clock3, FileText, LayoutDashboard, MapPin, Settings2, ShieldCheck, Users } from 'lucide-react'
import type { NavigationSection } from '../types/navigation'

export const navigation: NavigationSection[] = [
  { label: 'Pilotage', items: [{ label: 'Tableau de bord', route: 'dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'RH', 'EMPLOYEE'] }] },
  { label: 'Organisation', items: [{ label: 'Organisations', route: 'organizations', icon: Building2, roles: ['ADMIN'] }, { label: 'Sites', route: 'sites', icon: MapPin, roles: ['ADMIN'] }] },
  { label: 'Administration', items: [{ label: 'Utilisateurs & rôles', route: 'users', icon: ShieldCheck, roles: ['ADMIN'] }, { label: "Journal d'audit", route: 'settings', icon: Activity, roles: ['ADMIN'] }] },
  { label: 'Ressources humaines', items: [{ label: 'Employés', route: 'employees', icon: Users, roles: ['ADMIN', 'RH'] }, { label: 'Contrats & documents', route: 'contracts', icon: FileText, roles: ['RH'] }] },
  { label: 'Présence', items: [{ label: 'Présences', route: 'attendance', icon: ClipboardCheck, roles: ['RH'] }, { label: 'Timesheets', route: 'timesheets', icon: Clock3, roles: ['RH', 'EMPLOYEE'] }] },
  { label: 'Mon espace', items: [{ label: 'Mon profil', route: 'profile', icon: Users, roles: ['ADMIN', 'RH', 'EMPLOYEE'] }, { label: 'Paramètres', route: 'settings', icon: Settings2, roles: ['ADMIN'] }] },
]