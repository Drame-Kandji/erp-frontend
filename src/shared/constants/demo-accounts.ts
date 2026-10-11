import type { DemoAccount } from '../types/auth'

export const demoAccounts: DemoAccount[] = [
  { name: 'Super Admin', email: 'superadmin@noli.com', password: '123456789', role: 'SUPERADMIN', roleLabel: 'Super administrateur' },
  { name: 'Aminata Diop', email: 'admin@nolicore.local', password: 'admin123', role: 'ADMIN', roleLabel: 'Administratrice' },
  { name: 'Moussa Fall', email: 'rh@nolicore.local', password: 'rh123', role: 'RH', roleLabel: 'Responsable RH' },
  { name: 'Ibrahima Sarr', email: 'employee@nolicore.local', password: 'employee123', role: 'EMPLOYEE', roleLabel: 'Collaborateur' },
]
