import type { Grade } from '../../domain/scoring'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

const GRADE_TONE: Record<Grade, { card: string; chip: string; tile: string }> = {
  A: { card: 'border-good/40 bg-good', chip: 'bg-white/20', tile: 'bg-black/20' },
  B: { card: 'border-brand-dark/30 bg-brand', chip: 'bg-white/20', tile: 'bg-brand-dark/45' },
  C: { card: 'border-bad/40 bg-bad', chip: 'bg-white/20', tile: 'bg-black/20' },
}

const NEUTRAL = { card: 'border-brand-dark/30 bg-brand', chip: 'bg-white/20', tile: 'bg-brand-dark/45' }

/** `chakraPeriod` returns "18 Jun – 18 Jul 2026"; split it so the range reads as from → to. */
const splitPeriod = (period: string): [string, string] | null => {
  const parts = period.split('–').map((part) => part.trim())
  return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : null
}

interface SpotlightCardProps {
  eyebrow: string
  name: string
  grade: Grade | null
  period?: string | null
}

export function SpotlightCard({ eyebrow, name, grade, period }: SpotlightCardProps) {
  const tone = grade ? GRADE_TONE[grade] : NEUTRAL
  const range = period ? splitPeriod(period) : null

  return (
    <section
      className={cn(
        'card card-lift animate-rise group relative flex h-full flex-col overflow-hidden p-5 text-white [animation-delay:80ms]',
        tone.card,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgb(255_255_255/0.22),transparent_58%)]"
      />
      <Icon
        name="user"
        size={112}
        className="pointer-events-none absolute -right-5 top-1 opacity-15 transition-all duration-500 ease-soft group-hover:-right-3 group-hover:opacity-25"
      />

      <div className="relative flex h-full flex-col">
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] opacity-90">{eyebrow}</p>
        <h2
          key={name}
          className="animate-fade mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-balance sm:text-3xl"
        >
          {name}
        </h2>

        {grade ? (
          <span
            key={grade}
            className={cn(
              'animate-pop mt-3 w-fit rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.07em] ring-1 ring-white/20',
              tone.chip,
            )}
          >
            Grade {grade}
          </span>
        ) : null}

        {period ? (
          <div className="mt-auto pt-6">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] opacity-80">
              <Icon name="calendar" size={12} />
              Period
            </p>
            <div
              key={period}
              className={cn(
                'animate-fade mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl px-4 py-3.5 ring-1 ring-white/15 transition-transform duration-300 ease-soft hover:-translate-y-0.5',
                tone.tile,
              )}
            >
              {range ? (
                <>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-70">From</p>
                    <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums sm:text-2xl">{range[0]}</p>
                  </div>
                  {/* The icon set has no right arrow, so the back arrow is flipped. */}
                  <Icon name="back" size={20} className="shrink-0 rotate-180 opacity-55" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-70">To</p>
                    <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums sm:text-2xl">{range[1]}</p>
                  </div>
                </>
              ) : (
                <p className="text-xl font-black tracking-tight tabular-nums sm:text-2xl">{period}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
