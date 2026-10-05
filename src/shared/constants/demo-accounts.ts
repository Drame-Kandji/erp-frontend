import type { DemoAccount } from '../types/auth'

export const demoAccounts: DemoAccount[] = [
  { id: 'demo-admin', name: 'Aminata Diop', email: 'admin@nolicore.local', password: 'admin123', role: 'ADMIN', roleLabel: 'Administratrice', organizationName: 'NOLI CORE' },
  { id: 'demo-rh', name: 'Moussa Fall', email: 'rh@nolicore.local', password: 'rh123', role: 'RH', roleLabel: 'Responsable RH', organizationName: 'NOLI CORE' },
  { id: 'demo-employee', name: 'Ibrahima Sarr', email: 'employee@nolicore.local', password: 'employee123', role: 'EMPLOYEE', roleLabel: 'Collaborateur', organizationName: 'NOLI CORE' },
]