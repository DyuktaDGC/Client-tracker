import type { Grade } from '../../domain/scoring'
import { useCountUp } from '../../hooks/useCountUp'
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
}

export function ScoreHeadlineCard({ title, percent, grade, scored, possible }: ScoreHeadlineCardProps) {
  const tone = grade ? GRADE_TONE[grade] : NEUTRAL
  const counted = useCountUp(percent)

  return (
    <section className={cn('card card-lift animate-rise flex h-full flex-col p-5', tone.card)}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="label">{title}</h2>
        {grade ? (
          <span
            key={grade}
            className={cn(
              'animate-pop rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]',
              tone.chip,
            )}
          >
            Grade {grade}
          </span>
        ) : null}
      </div>

      <p className={cn('mt-4 mb-auto flex items-baseline gap-2', tone.value)}>
        <span className="text-5xl font-black tracking-tight tabular-nums sm:text-6xl">{formatPercent(counted)}</span>
        {grade ? (
          <span key={grade} className="animate-pop text-3xl font-black sm:text-4xl">
            {grade}
          </span>
        ) : null}
      </p>

      <Meter percent={percent} label={title} className="mt-5 bg-surface/60" />

      <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-ink-soft">
        <span>
          {scored} of {possible} points
        </span>
        <span>Target: 100%</span>
      </div>
    </section>
  )
}
