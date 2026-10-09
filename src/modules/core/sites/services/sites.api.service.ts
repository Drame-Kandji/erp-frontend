import { apiClient } from '../../../../lib/api/client'
import type { Site, SiteListResponse, SitePayload } from '../domain/site'

export type SiteListParams = { organization?: string; page?: number; status?: string }

export const sitesApiService = {
	async list(params: SiteListParams = {}) { 
    const response = await apiClient.get<SiteListResponse>('/sites/', { params }); 
    return response.data 
  },
	async get(id: string) { 
    const response = await apiClient.get<Site>(`/sites/${id}/`); 
    return response.data 
  },
	async create(payload: SitePayload) { 
    const response = await apiClient.post<Site>('/sites/', payload); 
    return response.data 
  },
	async update(id: string, payload: SitePayload) { 
    const response = await apiClient.put<Site>(`/sites/${id}/`, payload); 
    return response.data 
  },
	async patch(id: string, payload: Partial<SitePayload>) { 
    const response = await apiClient.patch<Site>(`/sites/${id}/`, payload); 
    return response.data 
  },
	async remove(id: string) { await apiClient.delete(`/sites/${id}/`) },
	async listAll(params: Omit<SiteListParams, 'page'> = {}) {
		const all: Site[] = []
		for (let page = 1; ; page += 1) {
			const data = await this.list({ ...params, page })
			all.push(...data.results)
			if (!data.next) break
		}
		return all
	},
}