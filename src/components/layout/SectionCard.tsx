import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

interface SectionCardProps {
  title: string
  subtitle: string
  icon: 'calendar' | 'trophy' | 'alert'
  tone?: 'brand' | 'good' | 'bad'
  className?: string
  children: ReactNode
}

const TONES = {
  brand: 'bg-brand-soft text-brand-dark',
  good: 'bg-good-soft text-good',
  bad: 'bg-bad-soft text-bad',
}

export function SectionCard({ title, subtitle, icon, tone = 'brand', className, children }: SectionCardProps) {
  return (
    <section className={cn('card card-lift animate-rise group flex min-w-0 flex-col gap-4 p-4 sm:p-5', className)}>
      <header className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-spring group-hover:scale-110',
            TONES[tone],
          )}
        >
          <Icon name={icon} size={17} />
        </span>
        <div>
          <h2 className="text-base font-extrabold">{title}</h2>
          <p className="text-xs text-ink-soft">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  )
}
