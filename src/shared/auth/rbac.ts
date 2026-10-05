import type { UserRole } from '../types/auth'

export type Permission = 'organization.read' | 'organization.manage' | 'site.read' | 'site.manage' | 'employee.read' | 'employee.manage' | 'attendance.self' | 'attendance.team' | 'timesheet.self' | 'timesheet.team' | 'audit.read'

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: ['organization.read', 'organization.manage', 'site.read', 'site.manage', 'employee.read', 'employee.manage', 'timesheet.team', 'audit.read'],
  RH: ['employee.read', 'employee.manage', 'attendance.team', 'timesheet.team'],
  EMPLOYEE: ['attendance.self', 'timesheet.self'],
}

export function can(role: UserRole, permission: Permission) { return rolePermissions[role].includes(permission) }