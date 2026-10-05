export type UserRole = 'ADMIN' | 'RH' | 'EMPLOYEE'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  organizationName: string
}

export type DemoAccount = AuthUser & {
  password: string
  roleLabel: string
}