import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersService } from '../services/users.service'
import type { UserCreatePayload, UserPayload } from '../domain/user'

export type UserFilters = {
  organization?: string
  site?: string
  department?: string
  status?: string
  email?: string
  page: number
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  allList: () => [...userKeys.all, 'list-all'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsersQuery(filters: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersService.list(filters),
  })
}

export function useUsersLookupQuery(organization?: string) {
  return useQuery({
    queryKey: [...userKeys.allList(), organization] as const,
    queryFn: () => usersService.listAll(organization ? { organization } : {}),
    staleTime: 30_000,
    enabled: organization ? Boolean(organization) : true,
  })
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => usersService.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreatePayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserPayload }) =>
      usersService.update(id, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.allList() });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}