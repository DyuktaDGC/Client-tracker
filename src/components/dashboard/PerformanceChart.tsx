import type { TrendPoint } from '../../domain/selectors'
import { cn } from '../../lib/cn'
import { formatPercent, formatScore } from '../../lib/format'

interface PerformanceChartProps {
  points: TrendPoint[]
  activeMonth: number | null
}

const GRID = [0, 25, 50, 75, 100]

export function PerformanceChart({ points, activeMonth }: PerformanceChartProps) {
  const plotted = points.filter((point) => point.percent !== null)

  if (plotted.length === 0) {
    return (
      <section className="card animate-rise p-6">
        <p className="text-sm text-ink-soft">No chakra has been scored for this selection yet.</p>
      </section>
    )
  }

  return (
    <section className="card animate-rise p-4 sm:p-6 md:p-7">
      <div className="pt-7">
        <div className="relative h-44 sm:h-56">
          {GRID.map((line) => (
            <div
              key={line}
              className="absolute inset-x-0 flex items-center gap-2 sm:gap-3"
              style={{ bottom: `${line}%`, transform: 'translateY(50%)' }}
            >
              <span className="w-6 shrink-0 text-right text-[10px] font-bold tabular-nums text-ink-faint sm:w-7 sm:text-[11px]">{line}</span>
              <span className={cn('h-px flex-1', line === 0 ? 'bg-line' : 'bg-line/60')} />
            </div>
          ))}

          <ol className="absolute inset-y-0 left-9 right-1 flex items-end gap-2 sm:left-12 sm:gap-3 md:gap-4">
            {points.map((point) => {
              const dimmed = activeMonth !== null && activeMonth !== point.month
              const height = point.percent === null ? 0 : Math.max(point.percent, 1.5)

              return (
                <li key={point.month} className="group relative h-full flex-1">
                  <div
                    title={`${point.label} — ${formatPercent(point.percent)} (${formatScore(point.scored)}/${formatScore(point.possible)})`}
                    className={cn(
                      'absolute inset-x-0 bottom-0 origin-bottom rounded-t-md group-hover:brightness-110',
                      point.percent === null ? 'bg-line/70' : dimmed ? 'bg-brand/35' : 'bg-brand',
                    )}
                    style={{ height: point.percent === null ? '2px' : `${height}%` }}
                  >
                    <span className="sr-only">
                      {point.label}: {formatPercent(point.percent)} ({formatScore(point.scored)} of{' '}
                      {formatScore(point.possible)} points)
                    </span>
                  </div>

                  {point.percent === null ? null : (
                    <p
                      className={cn(
                        'absolute inset-x-0 text-center text-[10px] font-black tabular-nums sm:text-[11px]',
                        dimmed ? 'text-ink-faint' : 'text-ink',
                      )}
                      style={{ bottom: `calc(${height}% + 0.3rem)` }}
                    >
                      {formatPercent(point.percent)}
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <ol className="mt-3 flex gap-2 pl-9 pr-1 sm:mt-4 sm:gap-3 sm:pl-12 sm:pr-2 md:gap-4">
          {points.map((point) => (
            <li
              key={point.month}
              title={point.label}
              className={cn(
                'flex-1 truncate text-center text-[10px] font-bold uppercase tracking-[0.06em] transition-colors duration-300 sm:text-[11px]',
                activeMonth === point.month ? 'text-brand-dark' : 'text-ink-soft',
              )}
            >
              {point.short}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
