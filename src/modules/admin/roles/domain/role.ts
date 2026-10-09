export type Role = {
  id: string
  organization: string
  name: string
  code: string
  description: string
  permissions: number[]
  users: string[]
  created_at: string
  updated_at: string
}

export type RolePayload = Omit<Role, 'id' | 'created_at' | 'updated_at'>

export type RoleListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Role[]
}

export type RoleListParams = {
  organization?: string
  code?: string
  name?: string
  page?: number
}