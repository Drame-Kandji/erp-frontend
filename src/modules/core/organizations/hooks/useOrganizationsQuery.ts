import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { organizationsService } from '../services/organizations.service'
import type { OrganizationPayload } from '../domain/organization'

export const organizationKeys = { 
  all: ['organizations'] as const, 
  lists: () => [...organizationKeys.all, 'list'] as const, 
  list: (page: number) => [...organizationKeys.lists(), { page }] as const, 
  details: () => [...organizationKeys.all, 'detail'] as const, 
  detail: (id: string) => [...organizationKeys.details(), id] as const 
}

export function useOrganizationsQuery(page: number) { 
  return useQuery({ 
    queryKey: organizationKeys.list(page), 
    queryFn: () => organizationsService.list({ page }) 
  }) 
}

export function useOrganizationQuery(id: string | undefined) { 
  return useQuery({ 
    queryKey: organizationKeys.detail(id ?? ''), 
    queryFn: () => organizationsService.get(id as string), 
    enabled: Boolean(id) 
  }) 
}

export function useCreateOrganizationMutation() { 
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: (payload: OrganizationPayload) => organizationsService.create(payload), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: organizationKeys.lists() }) 
  }) 
}

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: ({ id, payload }: { id: string; payload: OrganizationPayload }) => organizationsService.update(id, payload), 
    onSuccess: (organization) => { 
      queryClient.setQueryData(organizationKeys.detail(organization.id), organization); 
      return queryClient.invalidateQueries({ queryKey: organizationKeys.lists() }) } 
    }) 
  }
export function useDeleteOrganizationMutation() { 
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: (id: string) => organizationsService.remove(id), 
    onSuccess: (_, id) => { 
      queryClient.removeQueries({ queryKey: organizationKeys.detail(id) }); 
      return queryClient.invalidateQueries({ queryKey: organizationKeys.lists() }) 
    } 
  }) 
}