import { useQuery } from '@tanstack/react-query'
import { hrMockService } from '../services/hr.mock.service'

export const employeeKeys = { all: ['employees'] as const, list: () => [...employeeKeys.all, 'list'] as const }
export function useEmployeesQuery() { return useQuery({ queryKey: employeeKeys.list(), queryFn: hrMockService.listEmployees }) }