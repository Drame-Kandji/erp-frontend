import { apiClient } from '../../../../lib/api/client'
import type {
  Department,
  DepartmentListResponse,
  DepartmentPayload,
} from '../domain/department'

export type DepartmentListParams = {
  organization?: string
  code?: string
  name?: string
  page?: number
}

export const departmentsApiService = {
  async list(params: DepartmentListParams = {}) {
    const response = await apiClient.get<DepartmentListResponse>(
      '/departments/',
      { params },
    )
    return response.data
  },
  async get(id: string) {
    const response = await apiClient.get<Department>(`/departments/${id}/`)
    return response.data
  },
  async create(payload: DepartmentPayload) {
    const response = await apiClient.post<Department>('/departments/', payload)
    return response.data
  },
  async update(id: string, payload: DepartmentPayload) {
    const response = await apiClient.put<Department>(
      `/departments/${id}/`,
      payload,
    )
    return response.data
  },
  async patch(id: string, payload: Partial<DepartmentPayload>) {
    const response = await apiClient.patch<Department>(
      `/departments/${id}/`,
      payload,
    )
    return response.data
  },
  async remove(id: string) {
    await apiClient.delete(`/departments/${id}/`)
  },
  async listAll(params: Omit<DepartmentListParams, 'page'> = {}) {
    const all: Department[] = []
    for (let page = 1; ; page += 1) {
      const data = await this.list({ ...params, page })
      all.push(...data.results)
      if (!data.next) break
    }
    return all
  },
}