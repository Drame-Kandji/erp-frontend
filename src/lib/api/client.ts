import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { session } from '../../shared/auth/session'

const baseURL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const refreshClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = session.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refresh = session.getRefreshToken()
  if (!refresh) throw new Error('Aucun jeton de rafraîchissement disponible.')
  const { data } = await refreshClient.post<{
    access: string
    refresh?: string
  }>('/auth/refresh/', { refresh })
  session.setTokens({ access: data.access, refresh: data.refresh })
  return data.access
}

function isAuthEndpoint(url?: string) {
  return Boolean(
    url && (url.includes('/auth/login/') || url.includes('/auth/refresh/')),
  )
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      config &&
      !config._retry &&
      !isAuthEndpoint(config.url)
    ) {
      config._retry = true
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken()
        const access = await refreshPromise
        refreshPromise = null
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${access}`
        return apiClient(config)
      } catch (refreshError) {
        refreshPromise = null
        session.clear()
        window.dispatchEvent(new Event('noli:unauthorized'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Une erreur inattendue est survenue.'
  const data = error.response?.data
  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') return data.detail
    for (const value of Object.values(data as Record<string, unknown>)) {
      if (typeof value === 'string') return value
      if (Array.isArray(value) && value.length) return String(value[0])
    }
  }
  return 'La requête n’a pas pu être traitée.'
}
