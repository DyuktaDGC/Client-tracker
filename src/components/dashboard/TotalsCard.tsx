import { Icon } from '../ui/Icon'

interface TotalsCardProps {
  stats: Array<{ label: string; value: number; icon: 'user' | 'layers' | 'calendar' }>
}

export function TotalsCard({ stats }: TotalsCardProps) {
  return (
    <section className="card animate-rise grid gap-3 p-3 sm:grid-cols-3 sm:p-4" aria-label="Program totals">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card-lift flex items-center gap-3 rounded-xl border border-line bg-canvas/50 px-4 py-3"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
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
