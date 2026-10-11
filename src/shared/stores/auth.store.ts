import { create } from 'zustand'
import { authApiService } from '../../modules/auth/services/auth.api.service'
import { toAuthUser, type LoginResult } from '../../modules/auth/domain/auth'
import { session } from '../auth/session'
import type { AuthUser } from '../types/auth'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

type AuthState = {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  signIn: (result: LoginResult) => Promise<AuthUser>
  signOut: () => Promise<void>
  hydrate: () => Promise<void>
}

const unauthenticatedState = {
  user: null,
  status: 'unauthenticated' as AuthStatus,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  isAuthenticated: false,

  async signIn(result) {
    session.setTokens({ access: result.access, refresh: result.refresh })
    try {
      const me = await authApiService.me()
      const user = toAuthUser(me)
      set({ user, status: 'authenticated', isAuthenticated: true })
      return user
    } catch (error) {
      session.clear()
      set(unauthenticatedState)
      throw error
    }
  },

  async signOut() {
    const refresh = session.getRefreshToken()
    if (refresh) {
      try {
        await authApiService.logout(refresh)
      } catch {
        // Best effort: the local session is cleared regardless of the API result.
      }
    }
    session.clear()
    set(unauthenticatedState)
  },

  async hydrate() {
    if (get().status === 'loading') return
    if (!session.hasSession()) {
      set(unauthenticatedState)
      return
    }
    set({ status: 'loading' })
    try {
      const me = await authApiService.me()
      const user = toAuthUser(me)
      set({ user, status: 'authenticated', isAuthenticated: true })
    } catch {
      session.clear()
      set(unauthenticatedState)
    }
  },
}))

window.addEventListener('noli:unauthorized', () => {
  session.clear()
  useAuthStore.setState({
    user: null,
    status: 'unauthenticated',
    isAuthenticated: false,
  })
})
