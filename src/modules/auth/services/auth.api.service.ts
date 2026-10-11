import { apiClient } from '../../../lib/api/client'
import type { LoginPayload, LoginResult, MeResponse } from '../domain/auth'

export const authApiService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<LoginResult>('/auth/login/', payload)
    return data
  },
  async refresh(refresh: string) {
    const { data } = await apiClient.post<{ access: string; refresh?: string }>(
      '/auth/refresh/',
      { refresh },
    )
    return data
  },
  async logout(refresh: string) {
    await apiClient.post('/auth/logout/', { refresh })
  },
  async me() {
    const { data } = await apiClient.get<MeResponse>('/auth/me/')
    return data
  },
}
