import { useQuery } from '@tanstack/react-query'
import { auditService } from '../services/audit.service'
import type { AuditLogListParams } from '../domain/auditLog'

export const auditKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters: AuditLogListParams) =>
    [...auditKeys.lists(), filters] as const,
  details: () => [...auditKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditKeys.details(), id] as const,
}

export function useAuditLogsQuery(filters: AuditLogListParams) {
  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => auditService.list(filters),
  })
}

export function useAuditLogQuery(id: string | undefined) {
  return useQuery({
    queryKey: auditKeys.detail(id ?? ''),
    queryFn: () => auditService.get(id as string),
    enabled: Boolean(id),
  })
}