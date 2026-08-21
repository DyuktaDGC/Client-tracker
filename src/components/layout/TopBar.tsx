import { useSyncStatus } from '../../hooks/useSyncStatus'
import { cn } from '../../lib/cn'
import { formatDateTime } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { ViewToggle } from './ViewToggle'

export function TopBar() {
  const { syncedAt, isFetching, refresh } = useSyncStatus()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-brand transition-transform duration-300 ease-spring hover:scale-105">
          <Icon
            name="trend"
            size={20}
            className="transition-transform duration-300 ease-spring group-hover:-translate-y-0.5"
          />
        </span>
        <h1 className="hidden min-w-0 truncate text-base font-extrabold uppercase tracking-[0.06em] sm:block sm:text-lg">
          DGC Tracker
        </h1>

        <div
          className={cn(
            'ml-auto flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors duration-300',
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
              'press group/refresh flex h-9 w-9 items-center justify-center rounded-lg',
              isFetching ? 'bg-brand text-white' : 'bg-canvas text-ink-soft hover:bg-brand-soft hover:text-brand-dark',
            )}
          >
            <Icon
              name="refresh"
              size={16}
              className={cn(
                'transition-transform duration-300 ease-spring',
                isFetching ? 'animate-spin' : 'group-hover/refresh:rotate-90',
              )}
            />
          </button>
        </div>

        <div className="order-last flex w-full justify-center sm:justify-end">
          <ViewToggle className="w-full sm:w-auto" />
        </div>
      </div>
    </header>
  )
}
