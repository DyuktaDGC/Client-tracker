import { QueryClient } from '@tanstack/react-query'
import { RETRY_ATTEMPTS } from '../api/config'
import { ApiError } from '../lib/http'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < RETRY_ATTEMPTS
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: true,
      gcTime: 30 * 60_000,
    },
  },
})
