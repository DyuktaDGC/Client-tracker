import type { Performer } from '../../domain/selectors'
import { cn } from '../../lib/cn'
import { formatPercent } from '../../lib/format'
import { EmptyState } from '../../components/ui/EmptyState'
import { Meter } from '../../components/ui/Meter'

interface PerformerListProps {
  performers: Performer[]
  variant: 'top' | 'bottom'
  emptyTitle: string
}

export function PerformerList({ performers, variant, emptyTitle }: PerformerListProps) {
  if (performers.length === 0) return <EmptyState title={emptyTitle} description="No client has a score yet." />

  return (
    <ol className="stagger space-y-4">
      {performers.map((performer, index) => (
        <li
          key={performer.id}
          className="group flex items-start gap-3 transition-transform duration-300 ease-soft hover:translate-x-1"
        >
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white',
              'transition-transform duration-300 ease-spring group-hover:scale-110',
              variant === 'top' ? 'bg-brand' : 'bg-bad',
            )}
          >
            {variant === 'top' ? index + 1 : performers.length - index}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" title={performer.name}>
              {performer.name}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <Meter percent={performer.percent} label={`${performer.name} score`} />
              </span>
              <span className="w-11 shrink-0 text-right text-xs font-black tabular-nums">
                {formatPercent(performer.percent, 0)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
