import { useId } from 'react'
import { Icon } from './Icon'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
}

export function SearchInput({ value, onChange, placeholder = 'Search…', label }: SearchInputProps) {
  const id = useId()

  return (
    <div className="pill group w-full min-w-[12rem] flex-1 transition-colors duration-200 focus-within:border-brand/45 focus-within:bg-brand-soft/30">
      <Icon
        name="search"
        className="shrink-0 text-ink-faint transition-colors duration-200 group-focus-within:text-brand-dark"
      />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        maxLength={80}
        className="w-full bg-transparent text-sm font-medium placeholder:text-ink-faint focus:outline-none"
      />
    </div>
  )
}
