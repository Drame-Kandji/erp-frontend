import { apiClient } from '../../../../lib/api/client'
import type {
  User,
  UserCreatePayload,
  UserListParams,
  UserListResponse,
  UserPayload,
} from '../domain/user'

export const usersApiService = {
  async list(params: UserListParams = {}) {
    const response = await apiClient.get<UserListResponse>('/users/', { params })
    return response.data
  },
  async get(id: string) {
    const response = await apiClient.get<User>(`/users/${id}/`)
    return response.data
  },
  async create(payload: UserCreatePayload) {
    const response = await apiClient.post<User>('/users/', payload)
    return response.data
  },
  async update(id: string, payload: UserPayload) {
    const response = await apiClient.put<User>(`/users/${id}/`, payload)
    return response.data
  },
  async patch(id: string, payload: Partial<UserPayload>) {
    const response = await apiClient.patch<User>(`/users/${id}/`, payload)
    return response.data
  },
  async remove(id: string) {
    await apiClient.delete(`/users/${id}/`)
  },
  async listAll(params: Omit<UserListParams, 'page'> = {}) {
    const all: User[] = []
    for (let page = 1; ; page += 1) {
      const data = await this.list({ ...params, page })
      all.push(...data.results)
      if (!data.next) break
    }
    return all
  },
}