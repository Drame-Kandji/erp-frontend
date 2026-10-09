export type Permission = {
  id: number
  name: string
  codename: string
  app_label: string
  permission_code: string
}

export type PermissionListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Permission[]
}

export type PermissionListParams = { app_label?: string; page?: number }