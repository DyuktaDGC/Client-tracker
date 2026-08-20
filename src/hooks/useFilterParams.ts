import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useFilterParams<K extends string>(defaults: Record<K, string>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const values = useMemo(() => {
    const result = { ...defaults }
    for (const key of Object.keys(defaults) as K[]) {
      const value = searchParams.get(key)
      if (value !== null) result[key] = value.slice(0, 120)
    }
    return result
  }, [defaults, searchParams])

  const setValue = useCallback(
    (key: K, value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (!value || value === defaults[key]) next.delete(key)
          else next.set(key, value)
          return next
        },
        { replace: true },
      )
    },
    [defaults, setSearchParams],
  )

  const clear = useCallback(() => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        for (const key of Object.keys(defaults)) next.delete(key)
        return next
      },
      { replace: true },
    )
  }, [defaults, setSearchParams])

  const isDirty = useMemo(
    () => (Object.keys(defaults) as K[]).some((key) => values[key] !== defaults[key]),
    [defaults, values],
  )

  return [values, setValue, { clear, isDirty }] as const
}
