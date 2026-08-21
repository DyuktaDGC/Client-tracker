import { cn } from '../../lib/cn'
import { Icon, type IconName } from '../ui/Icon'

type Tone = 'brand' | 'good' | 'info'

interface TotalsCardProps {
  stats: Array<{ label: string; value: number | string; icon: IconName; tone?: Tone }>
}

const TONES: Record<Tone, { tile: string; icon: string }> = {
  brand: { tile: 'border-brand/25 bg-brand-soft/50', icon: 'bg-brand text-white' },
  good: { tile: 'border-good/25 bg-good-soft/60', icon: 'bg-good text-white' },
  info: { tile: 'border-info/25 bg-info-soft/60', icon: 'bg-info text-white' },
}

export function TotalsCard({ stats }: TotalsCardProps) {
  return (
    <section
      className={cn(
        'card animate-rise grid gap-3 p-3 sm:p-4',
        stats.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3',
      )}
      aria-label="Totals"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'card-lift flex items-center gap-3 rounded-xl border px-4 py-3',
            stat.tone ? TONES[stat.tone].tile : 'border-line bg-canvas/50',
          )}
        >
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              stat.tone ? TONES[stat.tone].icon : 'bg-brand-soft text-brand-dark',
            )}
          >
            <Icon name={stat.icon} size={19} />
          </span>
          <div className="min-w-0">
            <p className="label">{stat.label}</p>
            <p className="text-2xl font-black tabular-nums">{stat.value}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
