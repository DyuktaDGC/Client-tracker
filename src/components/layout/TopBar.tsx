import { useSyncStatus } from '../../hooks/useSyncStatus'
import { cn } from '../../lib/cn'
import { formatDateTime } from '../../lib/format'
import { Icon } from '../ui/Icon'

export function TopBar() {
  const { syncedAt, isFetching, refresh } = useSyncStatus()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-brand">
          <Icon name="trend" size={20} />
        </span>
        <h1 className="min-w-0 truncate text-base font-extrabold uppercase tracking-[0.06em] sm:text-lg">
          Client performance
        </h1>

        <div
          className={cn(
            'ml-auto flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors',
            isFetching ? 'border-brand/40 bg-brand-soft' : 'border-line bg-surface',
          )}
        >
          <p className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="label">{isFetching ? 'Syncing' : 'Last sync'}</span>
            <span className={cn('text-xs font-semibold tabular-nums', isFetching && 'animate-pulse text-brand-dark')}>
              {isFetching ? 'Fetching…' : formatDateTime(syncedAt)}
            </span>
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={isFetching}
            aria-label={isFetching ? 'Refreshing data' : 'Refresh data'}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              isFetching
                ? 'bg-brand text-white'
                : 'bg-canvas text-ink-soft hover:bg-brand-soft hover:text-brand-dark active:scale-95',
            )}
          >
            <Icon name="refresh" size={16} className={cn('transition-transform', isFetching && 'animate-spin')} />
          </button>
        </div>
      </div>
    </header>
  )
}
