import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { useCallback, useSyncExternalStore } from 'react'

export function useSyncStatus() {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()

  const subscribe = useCallback((onChange: () => void) => cache.subscribe(onChange), [cache])

  const getSyncedAt = useCallback(() => {
    let latest = ''
    for (const query of cache.getAll()) {
      const data = query.state.data as { syncedAt?: unknown } | undefined
      if (data && typeof data.syncedAt === 'string' && data.syncedAt > latest) latest = data.syncedAt
    }
    return latest
  }, [cache])

  const syncedAt = useSyncExternalStore(subscribe, getSyncedAt, () => '')
  const isFetching = useIsFetching() > 0

  return {
    syncedAt: syncedAt || null,
    isFetching,
    refresh: () => queryClient.invalidateQueries(),
  }
}
