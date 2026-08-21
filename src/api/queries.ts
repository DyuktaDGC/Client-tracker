import { useQuery } from '@tanstack/react-query'
import { AUTO_REFRESH_MS, STALE_TIME_MS } from './config'
import { fetchAssignments, fetchDashboard } from './endpoints'
import { queryKeys } from './keys'

export const useDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: ({ signal }) => fetchDashboard(signal),
    staleTime: STALE_TIME_MS,
    refetchInterval: AUTO_REFRESH_MS,
  })

export const useAssignments = () =>
  useQuery({
    queryKey: queryKeys.assignments,
    queryFn: ({ signal }) => fetchAssignments(signal),
    staleTime: STALE_TIME_MS,
    refetchInterval: AUTO_REFRESH_MS,
  })
