import type { Employee } from '../domain/employee'

const employees: Employee[] = [
  { id: 'emp-001', employeeNumber: 'NC-001', name: 'Fatou Ndiaye', organization: 'NOLI CORE', site: 'Site Dakar', department: 'Opérations', position: 'Cheffe de chantier', status: 'active', hiredAt: '2024-01-15' },
  { id: 'emp-002', employeeNumber: 'NC-014', name: 'Ousmane Ba', organization: 'Sahel Matériaux', site: 'Carrière de Thiès', department: 'Production', position: 'Conducteur d’engins', status: 'active', hiredAt: '2023-08-02' },
  { id: 'emp-003', employeeNumber: 'NC-021', name: 'Awa Seck', organization: 'NOLI CORE', site: 'Site Dakar', department: 'Finance', position: 'Gestionnaire', status: 'on_leave', hiredAt: '2022-11-21' },
  { id: 'emp-004', employeeNumber: 'NC-032', name: 'Mamadou Kane', organization: 'Teranga Bâtiment', site: 'Base Kaolack', department: 'Maintenance', position: 'Technicien', status: 'active', hiredAt: '2025-02-10' },
]

export const hrMockService = { async listEmployees() { return employees } }