import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  icon?: 'calendar' | 'user' | 'building' | 'bolt' | 'layers' | 'search'
  disabled?: boolean
}

export function Select({ label, value, options, onChange, icon, disabled }: SelectProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedIndex = useMemo(() => options.findIndex((option) => option.value === value), [options, value])
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const close = useCallback(() => setOpen(false), [])

  const commit = useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      onChange(option.value)
      close()
    },
    [close, onChange, options],
  )

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const onResize = () => close()

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
    }
  }, [close, open])

  useLayoutEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (disabled || options.length === 0) return
    setActiveIndex(index)
    setOpen(true)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        if (!open) {
          openList()
          return
        }
        setActiveIndex((current) => (current + step + options.length) % options.length)
        return
      }
      case 'Home':
      case 'End': {
        if (!open) return
        event.preventDefault()
        setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
        return
      }
      case 'Enter':
      case ' ': {
        event.preventDefault()
        if (open) commit(activeIndex)
        else openList()
        return
      }
      case 'Escape': {
        if (!open) return
        event.preventDefault()
        close()
        return
      }
      case 'Tab': {
        close()
      }
    }
  }

  return (
    <div ref={rootRef} className="relative w-full min-w-[10rem] sm:w-auto sm:min-w-[13rem]">
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>

      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        className={cn(
          'pill press w-full justify-between pr-2.5',
          'hover:border-brand/45 hover:bg-brand-soft/45',
          open && 'border-brand bg-brand-soft/60 ring-2 ring-brand/25',
          disabled && 'cursor-not-allowed text-ink-faint',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon ? <Icon name={icon} className={cn('shrink-0', open ? 'text-brand-dark' : 'text-ink-faint')} /> : null}
          <span id={`${id}-value`} className="truncate text-sm font-semibold uppercase tracking-[0.03em]">
            {selected?.label ?? label}
          </span>
        </span>
        <Icon
          name="chevron"
          size={15}
          className={cn('shrink-0 text-ink-faint transition-transform duration-150', open && 'rotate-180 text-brand-dark')}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          className="animate-drop absolute left-0 z-50 mt-2 max-h-72 w-max min-w-full max-w-[min(30rem,calc(100vw-3rem))] origin-top overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface p-1.5 shadow-[0_18px_40px_-18px_rgba(18,32,58,0.45)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex

            return (
              <li key={option.value}>
                <button
                  type="button"
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold uppercase leading-snug tracking-[0.02em] transition-colors duration-150',
                    isSelected ? 'text-brand-dark' : 'text-ink',
                    isActive ? 'bg-brand-soft' : 'bg-transparent',
                  )}
                >
                  <span className="min-w-0 flex-1">{option.label}</span>
                  {isSelected ? (
                    <Icon name="check" size={14} className="animate-pop mt-0.5 shrink-0 text-brand-dark" />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
