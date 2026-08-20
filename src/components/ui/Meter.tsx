import { cn } from '../../lib/cn'
import { bandOf, type Band } from '../../domain/scoring'

const FILL: Record<Band, string> = {
  high: 'bg-good',
  good: 'bg-brand',
  fair: 'bg-amber',
  low: 'bg-bad',
  none: 'bg-line',
}

interface MeterProps {
  percent: number | null
  label: string
  className?: string
}

export function Meter({ percent, label, className }: MeterProps) {
  const width = Math.max(0, Math.min(100, percent ?? 0))

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-canvas', className)}
      role="meter"
      aria-valuenow={percent ?? 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', FILL[bandOf(percent)])}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
