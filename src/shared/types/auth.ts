export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'RH' | 'EMPLOYEE'

export type AuthRole = {
  code: string
  name: string
}

export type AuthUser = {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  roleLabel: string
  roles: AuthRole[]
  permissions: string[]
  organizationId: string | null
  organizationName: string
  organizationCode: string | null
  isSuperuser: boolean
}

export type DemoAccount = {
  name: string
  email: string
  password: string
  role: UserRole
  roleLabel: string
}
