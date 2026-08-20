import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'

interface FilterBarProps {
  children: ReactNode
  onClear?: () => void
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <section className="card flex flex-wrap items-center gap-2 p-3 sm:gap-3 sm:p-4" aria-label="Filters">
      {children}

      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center gap-1.5 sm:ml-auto rounded-xl border border-line px-3 text-xs font-bold uppercase tracking-[0.06em] text-ink-soft transition-colors hover:border-bad/40 hover:bg-bad-soft hover:text-bad"
        >
          <Icon name="close" size={14} />
          Clear
        </button>
      ) : null}
    </section>
  )
}
