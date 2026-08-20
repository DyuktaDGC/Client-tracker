import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches

const easeOut = (t: number) => 1 - (1 - t) ** 3

export function useCountUp(target: number | null, duration = 850) {
  const [frameValue, setFrameValue] = useState<number | null>(null)
  const [reduced] = useState(prefersReducedMotion)
  const fromRef = useRef(0)

  useEffect(() => {
    if (target === null || !Number.isFinite(target)) return

    if (reduced) {
      fromRef.current = target
      return
    }

    const from = fromRef.current
    const delta = target - from

    if (delta === 0) return

    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const current = progress < 1 ? from + delta * easeOut(progress) : target

      fromRef.current = current
      setFrameValue(current)

      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  if (target === null || !Number.isFinite(target)) return target
  if (reduced) return target

  return frameValue ?? 0
}
