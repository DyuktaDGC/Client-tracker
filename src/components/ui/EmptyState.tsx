import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canvas text-ink-faint">
        <Icon name="inbox" size={20} />
      </span>
      <h3 className="text-base font-bold">{title}</h3>
      {description ? <p className="max-w-md text-sm text-ink-soft">{description}</p> : null}
      {action}
    </div>
  )
}
