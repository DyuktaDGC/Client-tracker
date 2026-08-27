import { cn } from '../../lib/cn'
import { formatScore } from '../../lib/format'

const HIGH_SCORE = 6

export function ScoreChip({ value }: { value: number | null }) {
  const tone =
    value === null
      ? 'bg-canvas text-ink-faint border-line'
      : value >= HIGH_SCORE
        ? 'bg-good-soft text-good border-good/20'
        : 'bg-bad-soft text-bad border-bad/20'

  return (
    <span
      className={cn(
        'inline-flex min-w-[2.5rem] justify-center rounded-lg border px-1.5 py-0.5 text-xs font-bold tabular-nums sm:min-w-[3rem] sm:px-2 sm:py-1 sm:text-sm',
        'transition-transform duration-200 ease-spring hover:scale-105',
        tone,
      )}
    >
      {value === null ? '—' : formatScore(value)}
    </span>
  )
}
