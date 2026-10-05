import { useQuery } from '@tanstack/react-query'
import { attendanceMockService } from '../services/attendance.mock.service'
export const attendanceKeys = { 
  all: ['attendance'] as const, list: () => [...attendanceKeys.all, 'list'] as const }
export function useAttendanceQuery() { 
  return useQuery({ queryKey: attendanceKeys.list(), 
    queryFn: attendanceMockService.list }) }