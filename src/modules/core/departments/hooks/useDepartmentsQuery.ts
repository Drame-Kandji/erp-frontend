import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { departmentsService } from '../services/departments.service'
import type { DepartmentPayload } from '../domain/department'

export type DepartmentFilters = {
  organization?: string
  code?: string
  name?: string
  page: number
}

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: DepartmentFilters) => [...departmentKeys.lists(), filters] as const,
  allList: () => [...departmentKeys.all, 'list-all'] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
}

export function useDepartmentsQuery(filters: DepartmentFilters) {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: () => departmentsService.list(filters),
  })
}

export function useDepartmentsLookupQuery(organization?: string) {
  return useQuery({
    queryKey: [...departmentKeys.allList(), organization] as const,
    queryFn: () => departmentsService.listAll(organization ? { organization } : {}),
    staleTime: 60_000,
  })
}

export function useDepartmentQuery(id: string | undefined) {
  return useQuery({
    queryKey: departmentKeys.detail(id ?? ''),
    queryFn: () => departmentsService.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) => departmentsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentKeys.lists() }),
  });
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepartmentPayload }) =>
      departmentsService.update(id, payload),
    onSuccess: (department) => {
      queryClient.setQueryData(departmentKeys.detail(department.id), department);
      return queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: departmentKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}