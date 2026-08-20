import { cn } from '../../lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="animate-rise flex w-full flex-wrap items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(18,32,58,0.06)] sm:w-fit"
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'press inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold uppercase tracking-[0.06em] sm:flex-none sm:px-4',
              'transition-[scale,background-color,color,box-shadow] duration-200 ease-soft',
              active
                ? 'bg-brand text-white shadow-[0_2px_8px_-2px_rgba(239,127,31,0.65)]'
                : 'text-ink-soft hover:bg-brand-soft hover:text-brand-dark',
            )}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span
                key={option.count}
                className={cn(
                  'animate-pop rounded-md px-1.5 py-0.5 text-[11px] tabular-nums',
                  active ? 'bg-white/25 text-white' : 'bg-canvas text-ink-faint',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
