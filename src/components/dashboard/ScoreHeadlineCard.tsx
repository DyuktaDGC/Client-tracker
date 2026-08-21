import type { Grade } from '../../domain/scoring'
import { cn } from '../../lib/cn'
import { formatPercent } from '../../lib/format'
import { Meter } from '../ui/Meter'

const GRADE_TONE: Record<Grade, { card: string; value: string; chip: string }> = {
  A: {
    card: 'border-good/25 bg-good-soft',
    value: 'text-good',
    chip: 'border-good/25 bg-surface/80 text-good',
  },
  B: {
    card: 'border-highlight-line bg-highlight',
    value: 'text-brand-dark',
    chip: 'border-brand/25 bg-surface/80 text-brand-dark',
  },
  C: {
    card: 'border-bad/25 bg-bad-soft',
    value: 'text-bad',
    chip: 'border-bad/25 bg-surface/80 text-bad',
  },
}

const NEUTRAL = {
  card: 'border-line bg-surface',
  value: 'text-ink-soft',
  chip: 'border-line bg-canvas text-ink-soft',
}

interface ScoreHeadlineCardProps {
  title: string
  percent: number | null
  grade: Grade | null
  scored: number
  possible: number
  unit?: string
}

export function ScoreHeadlineCard({ title, percent, grade, scored, possible, unit = 'points' }: ScoreHeadlineCardProps) {
  const tone = grade ? GRADE_TONE[grade] : NEUTRAL

  return (
    <section className={cn('card card-lift animate-rise relative flex h-full flex-col overflow-hidden p-5', tone.card)}>
      {/* Soft top-right sheen so the flat pastel fill reads as a lit surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgb(255_255_255/0.6),transparent_60%)]"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="label">{title}</h2>
          {grade ? (
            <span
              key={grade}
              className={cn(
                'animate-pop rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em]',
                tone.chip,
              )}
            >
              Grade {grade}
            </span>
          ) : null}
        </div>

        <div className={cn('my-auto flex items-baseline gap-3 py-3', tone.value)}>
          <span className="text-5xl font-black tracking-tight tabular-nums sm:text-6xl">{formatPercent(percent)}</span>
          {grade ? (
            <span key={grade} className="animate-pop text-4xl font-black leading-none sm:text-5xl">
              {grade}
            </span>
          ) : null}
        </div>

        <Meter percent={percent} label={title} className="bg-surface/60" />

        <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-ink-soft">
          <span>
            {scored} of {possible} {unit}
          </span>
          <span>Target: 100%</span>
        </div>
      </div>
    </section>
  )
}
