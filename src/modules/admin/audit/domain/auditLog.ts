export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'PERMISSION_CHANGED'

export type AuditLog = {
  id: string
  organization: string
  actor: string | null
  actor_email: string | null
  action: AuditAction
  resource_type: string
  resource_id: string | null
  resource_repr: string
  timestamp: string
  ip_address: string | null
  user_agent: string
  request_id: string
  method: string
  path: string
  status_code: number | null
  success: boolean
  changes: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
}

export type AuditLogListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: AuditLog[]
}

export type AuditLogListParams = {
  action?: string
  actor?: string
  resource_type?: string
  resource_id?: string
  date_from?: string
  date_to?: string
  success?: boolean
  search?: string
  page?: number
}