const ACCESS_TOKEN_KEY = 'noli_access_token'
const REFRESH_TOKEN_KEY = 'noli_refresh_token'

export type TokenPair = {
  access: string
  refresh?: string | null
}

export const session = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens({ access, refresh }: TokenPair) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
  hasSession() {
    return Boolean(
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
        localStorage.getItem(REFRESH_TOKEN_KEY),
    )
  },
}
