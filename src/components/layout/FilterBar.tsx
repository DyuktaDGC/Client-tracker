import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'

interface FilterBarProps {
  children: ReactNode
  actions?: ReactNode
  onClear?: () => void
}

export function FilterBar({ children, actions, onClear }: FilterBarProps) {
  return (
    <section className="card animate-rise flex flex-wrap items-center gap-2 p-3 sm:gap-3 sm:p-4" aria-label="Filters">
      {children}

      {actions || onClear ? (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:gap-3">
          {actions}

          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="press group animate-pop inline-flex h-11 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-bold uppercase tracking-[0.06em] text-ink-soft hover:border-bad/40 hover:bg-bad-soft hover:text-bad"
            >
              <Icon
                name="close"
                size={14}
                className="transition-transform duration-300 ease-spring group-hover:rotate-90"
              />
              Clear
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
