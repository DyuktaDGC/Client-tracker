import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'

interface PageHeadingProps {
  title: string
  icon?: 'bolt' | 'trend' | 'calendar'
  aside?: ReactNode
}

export function PageHeading({ title, icon = 'bolt', aside }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon name={icon} size={18} />
        </span>
        <h2 className="text-lg font-extrabold uppercase tracking-[0.04em] sm:text-xl">{title}</h2>
      </div>
      {aside}
    </div>
  )
}
