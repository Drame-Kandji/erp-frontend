import { create } from 'zustand'
import type { AuthUser } from '../types/auth'

type AuthState = { user: AuthUser | null; isAuthenticated: boolean; signIn: (user: AuthUser) => void; signOut: () => void }

const storedUser = localStorage.getItem('noli_user')

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) as AuthUser : null,
  isAuthenticated: Boolean(storedUser),
  signIn: (user) => { localStorage.setItem('noli_user', JSON.stringify(user)); set({ user, isAuthenticated: true }) },
  signOut: () => { localStorage.removeItem('noli_user'); set({ user: null, isAuthenticated: false }) },
}))