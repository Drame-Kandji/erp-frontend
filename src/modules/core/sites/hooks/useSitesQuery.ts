import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sitesService } from '../services/sites.service'
import type { SitePayload } from '../domain/site'

export type SiteFilters = { 
  organization?: string; 
  page: number; 
  status?: string 
}
export const siteKeys = { 
  all: ['sites'] as const, 
  lists: () => [...siteKeys.all, 'list'] as const, 
  list: (filters: SiteFilters) => [...siteKeys.lists(), filters] as const, 
  details: () => [...siteKeys.all, 'detail'] as const, detail: (id: string) => [...siteKeys.details(), id] as const 
}
export function useSitesQuery(filters: SiteFilters) { 
  return useQuery({ 
    queryKey: siteKeys.list(filters), 
    queryFn: () => sitesService.list(filters) 
  }) 
}
export function useSiteQuery(id: string | undefined) { 
  return useQuery({ 
    queryKey: siteKeys.detail(id ?? ''), 
    queryFn: () => sitesService.get(id as string), 
    enabled: Boolean(id) 
  }) 
}
export function useCreateSiteMutation() { 
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: (payload: SitePayload) => sitesService.create(payload), 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: siteKeys.lists() }) 
  }) 
}
export function useUpdateSiteMutation() { 
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: ({ id, payload }: { id: string; payload: SitePayload }) => sitesService.update(id, payload), 
    onSuccess: (site) => { 
      queryClient.setQueryData(siteKeys.detail(site.id), site); 
      return queryClient.invalidateQueries({ queryKey: siteKeys.lists() }) 
    } 
  }) 
}
export function useDeleteSiteMutation() { 
  const queryClient = useQueryClient(); 
  return useMutation({ 
    mutationFn: (id: string) => sitesService.remove(id), 
    onSuccess: (_, id) => { queryClient.removeQueries({ queryKey: siteKeys.detail(id) }); return queryClient.invalidateQueries({ queryKey: siteKeys.lists() }) } 
  }) 
}