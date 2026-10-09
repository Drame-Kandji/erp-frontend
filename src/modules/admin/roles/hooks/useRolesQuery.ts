import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rolesService } from '../services/roles.service'
import type { RolePayload } from '../domain/role'

export type RoleFilters = {
  organization?: string
  code?: string
  name?: string
  page: number
}

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: RoleFilters) => [...roleKeys.lists(), filters] as const,
  allList: () => [...roleKeys.all, 'list-all'] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
}

export function useRolesQuery(filters: RoleFilters) {
  return useQuery({
    queryKey: roleKeys.list(filters),
    queryFn: () => rolesService.list(filters),
  })
}

export function useRolesLookupQuery(organization?: string) {
  return useQuery({
    queryKey: [...roleKeys.allList(), organization] as const,
    queryFn: () => rolesService.listAll(organization ? { organization } : {}),
    staleTime: 60_000,
  })
}

export function useRoleQuery(id: string | undefined) {
  return useQuery({
    queryKey: roleKeys.detail(id ?? ''),
    queryFn: () => rolesService.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RolePayload) => rolesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RolePayload }) =>
      rolesService.update(id, payload),
    onSuccess: (role) => {
      queryClient.setQueryData(roleKeys.detail(role.id), role);
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: roleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}