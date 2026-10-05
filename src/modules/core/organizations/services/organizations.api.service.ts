import { apiClient } from '../../../../lib/api/client'
import type { Organization, OrganizationListResponse, OrganizationPayload } from '../domain/organization'

export type OrganizationListParams = { page?: number }

export const organizationsApiService = {
	async list(params: OrganizationListParams = {}) {
		const response = await apiClient.get<OrganizationListResponse>('/organizations/', { params })
		return response.data
	},
	async get(id: string) {
		const response = await apiClient.get<Organization>(`/organizations/${id}/`)
		return response.data
	},
	async create(payload: OrganizationPayload) {
		const response = await apiClient.post<Organization>('/organizations/', payload)
		return response.data
	},
	async update(id: string, payload: OrganizationPayload) {
		const response = await apiClient.put<Organization>(`/organizations/${id}/`, payload)
		return response.data
	},
	async patch(id: string, payload: Partial<OrganizationPayload>) {
		const response = await apiClient.patch<Organization>(`/organizations/${id}/`, payload)
		return response.data
	},
	async remove(id: string) {
		await apiClient.delete(`/organizations/${id}/`)
	},
}