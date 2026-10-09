import { apiClient } from '../../../../lib/api/client'
import type {
  Permission,
  PermissionListParams,
  PermissionListResponse,
} from '../domain/permission'

export const permissionsApiService = {
  async list(params: PermissionListParams = {}) {
    const response = await apiClient.get<PermissionListResponse>(
      '/permissions/',
      { params },
    )
    return response.data
  },
  async get(id: number) {
    const response = await apiClient.get<Permission>(`/permissions/${id}/`)
    return response.data
  },
  async listAll() {
    const all: Permission[] = []
    for (let page = 1; ; page += 1) {
      const data = await this.list({ page })
      all.push(...data.results)
      if (!data.next) break
    }
    return all
  },
}