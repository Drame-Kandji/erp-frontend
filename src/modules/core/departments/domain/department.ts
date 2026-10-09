export type Department = {
  id: string
  organization: string
  name: string
  code: string
  description: string
  created_at: string
  updated_at: string
}

export type DepartmentPayload = Omit<
  Department,
  'id' | 'created_at' | 'updated_at'
>

export type DepartmentListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Department[]
}