import type { LucideIcon } from 'lucide-react'
import type { UserRole } from './auth'

export type AppRoute = 'dashboard' | 'organizations' | 'sites' | 'users' | 'employees' | 'contracts' | 'attendance' | 'timesheets' | 'profile' | 'settings'

export type NavigationItem = {
  label: string
  route: AppRoute
  icon: LucideIcon
  roles: UserRole[]
}

export type NavigationSection = {
  label: string
  items: NavigationItem[]
}