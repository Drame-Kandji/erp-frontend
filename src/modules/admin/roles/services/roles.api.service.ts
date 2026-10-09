import { apiClient } from '../../../../lib/api/client'
import type { Role, RoleListParams, RoleListResponse, RolePayload } from '../domain/role'

export const rolesApiService = {
  async list(params: RoleListParams = {}) {
    const response = await apiClient.get<RoleListResponse>('/roles/', { params })
    return response.data
  },
  async get(id: string) {
    const response = await apiClient.get<Role>(`/roles/${id}/`)
    return response.data
  },
  async create(payload: RolePayload) {
    const response = await apiClient.post<Role>('/roles/', payload)
    return response.data
  },
  async update(id: string, payload: RolePayload) {
    const response = await apiClient.put<Role>(`/roles/${id}/`, payload)
    return response.data
  },
  async patch(id: string, payload: Partial<RolePayload>) {
    const response = await apiClient.patch<Role>(`/roles/${id}/`, payload)
    return response.data
  },
  async remove(id: string) {
    await apiClient.delete(`/roles/${id}/`)
  },
  async listAll(params: Omit<RoleListParams, 'page'> = {}) {
    const all: Role[] = []
    for (let page = 1; ; page += 1) {
      const data = await this.list({ ...params, page })
      all.push(...data.results)
      if (!data.next) break
    }
    return all
  },
}