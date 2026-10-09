import { apiClient } from '../../../../lib/api/client'
import type {
  AuditLog,
  AuditLogListParams,
  AuditLogListResponse,
} from '../domain/auditLog'

export const auditApiService = {
  async list(params: AuditLogListParams = {}) {
    const response = await apiClient.get<AuditLogListResponse>(
      '/audit-logs/',
      { params },
    )
    return response.data
  },
  async get(id: string) {
    const response = await apiClient.get<AuditLog>(`/audit-logs/${id}/`)
    return response.data
  },
}