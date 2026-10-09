export type UserStatus = 'active' | 'inactive' | 'suspended'

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  organization: string
  site: string | null
  department: string | null
  roles: string[]
  status: UserStatus
  is_active: boolean
  is_staff: boolean
  created_at: string
  updated_at: string
  last_login: string | null
}

export type UserPayload = Omit<
  User,
  'id' | 'is_staff' | 'created_at' | 'updated_at' | 'last_login'
>

export type UserCreatePayload = UserPayload & { password: string }

export type UserListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

export type UserListParams = {
  organization?: string
  site?: string
  department?: string
  status?: string
  is_active?: string
  email?: string
  page?: number
}