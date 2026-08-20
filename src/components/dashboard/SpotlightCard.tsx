import type { Grade } from '../../domain/scoring'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

const GRADE_TONE: Record<Grade, { card: string; chip: string; tile: string }> = {
  A: { card: 'border-good/40 bg-good', chip: 'bg-white/20', tile: 'bg-black/20' },
  B: { card: 'border-brand-dark/30 bg-brand', chip: 'bg-white/20', tile: 'bg-brand-dark/45' },
  C: { card: 'border-bad/40 bg-bad', chip: 'bg-white/20', tile: 'bg-black/20' },
}

const NEUTRAL = { card: 'border-brand-dark/30 bg-brand', chip: 'bg-white/20', tile: 'bg-brand-dark/45' }

interface SpotlightStat {
  label: string
  value: string
}

interface SpotlightCardProps {
  eyebrow: string
  name: string
  grade: Grade | null
  period?: string | null
  stats: SpotlightStat[]
}

export function SpotlightCard({ eyebrow, name, grade, period, stats }: SpotlightCardProps) {
  const tone = grade ? GRADE_TONE[grade] : NEUTRAL

  return (
    <section className={cn('card relative flex h-full flex-col overflow-hidden p-5 text-white', tone.card)}>
      <Icon name="user" size={96} className="pointer-events-none absolute -right-4 top-2 opacity-15" />
      <p className="text-[11px] font-bold uppercase tracking-[0.09em] opacity-90">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-balance sm:text-3xl">{name}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {grade ? (
          <span className={cn('rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.07em]', tone.chip)}>
            Grade {grade}
          </span>
        ) : null}
        {period ? (
          <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold', tone.chip)}>
            <Icon name="calendar" size={13} />
            {period}
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 pt-1">
        {stats.map((stat) => (
          <div key={stat.label} className={cn('rounded-xl px-3 py-3', tone.tile)}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-85">{stat.label}</dt>
            <dd className="mt-1 text-lg font-black">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
