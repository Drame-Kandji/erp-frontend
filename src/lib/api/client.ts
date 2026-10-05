import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('noli_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('noli_access_token')
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Une erreur inattendue est survenue.'
  const data = error.response?.data as { detail?: string } | undefined
  return data?.detail ?? 'La requête n’a pas pu être traitée.'
}