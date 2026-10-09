import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '../services/permissions.service'

export const permissionKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionKeys.all, 'list'] as const,
  allList: () => [...permissionKeys.all, 'list-all'] as const,
}

export function usePermissionsQuery(appLabel?: string) {
  return useQuery({
    queryKey: [...permissionKeys.list(), appLabel] as const,
    queryFn: () =>
      appLabel
        ? permissionsService.list({ app_label: appLabel })
        : permissionsService.list({}),
  })
}

export function useAllPermissionsQuery() {
  return useQuery({
    queryKey: permissionKeys.allList(),
    queryFn: () => permissionsService.listAll(),
    staleTime: 5 * 60_000,
  })
}