import type { AuthRole, AuthUser, UserRole } from '../../../shared/types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginUserSummary = {
  id: string
  email: string
  first_name: string
  last_name: string
  organization_id: string | null
  is_superuser: boolean
}

export type LoginResult = {
  access: string
  refresh: string
  user: LoginUserSummary
}

export type MeOrganization = {
  id: string
  name: string
  code: string
}

export type MeResponse = {
  id: string
  email: string
  first_name: string
  last_name: string
  organization: MeOrganization | null
  roles: AuthRole[]
  permissions: string[]
  is_superuser: boolean
}

export type { AuthRole }

const SUPER_ADMIN_ROLE_CODES = new Set(['SUPER_ADMIN', 'SUPERADMIN'])
const ADMIN_ROLE_CODES = new Set(['ADMIN'])
const RH_ROLE_CODES = new Set(['HR_MANAGER', 'RH'])

function resolvePrimaryRole(roles: AuthRole[], isSuperuser: boolean): UserRole {
  if (isSuperuser) return 'SUPERADMIN'
  const codes = roles.map((role) => role.code.toUpperCase())
  if (codes.some((code) => SUPER_ADMIN_ROLE_CODES.has(code))) return 'SUPERADMIN'
  if (codes.some((code) => ADMIN_ROLE_CODES.has(code))) return 'ADMIN'
  if (codes.some((code) => RH_ROLE_CODES.has(code))) return 'RH'
  return 'EMPLOYEE'
}

function resolveRoleLabel(
  roles: AuthRole[],
  isSuperuser: boolean,
  role: UserRole,
): string {
  if (isSuperuser || role === 'SUPERADMIN') return 'Super administrateur'
  const primary =
    roles.find((entry) => ADMIN_ROLE_CODES.has(entry.code.toUpperCase())) ??
    roles.find((entry) => RH_ROLE_CODES.has(entry.code.toUpperCase())) ??
    roles[0]
  if (primary) return primary.name
  if (role === 'ADMIN') return 'Administrateur'
  if (role === 'RH') return 'Responsable RH'
  return 'Collaborateur'
}

export function toAuthUser(me: MeResponse): AuthUser {
  const name = `${me.first_name} ${me.last_name}`.trim() || me.email
  const role = resolvePrimaryRole(me.roles, me.is_superuser)
  const roles: AuthRole[] =
    me.roles && me.roles.length
      ? me.roles
      : me.is_superuser
        ? [{ code: 'SUPER_ADMIN', name: 'Super administrateur' }]
        : []
  return {
    id: me.id,
    name,
    firstName: me.first_name,
    lastName: me.last_name,
    email: me.email,
    role,
    roleLabel: resolveRoleLabel(roles, me.is_superuser, role),
    roles,
    permissions: me.permissions ?? [],
    organizationId: me.organization?.id ?? null,
    organizationName: me.organization?.name ?? 'NOLI CORE',
    organizationCode: me.organization?.code ?? null,
    isSuperuser: me.is_superuser,
  }
}
