import { useEffect, useRef, useState } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches

const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * Animates a number towards `target`, easing out. Passes `null` straight
 * through so callers keep rendering their own em-dash placeholder, and snaps
 * to the target when the user asks for reduced motion.
 */
export function useCountUp(target: number | null, duration = 850) {
  const [value, setValue] = useState<number | null>(target === null ? null : 0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (target === null || !Number.isFinite(target)) {
      setValue(target)
      return
    }

    if (prefersReducedMotion()) {
      fromRef.current = target
      setValue(target)
      return
    }

    const from = fromRef.current
    const delta = target - from

    if (delta === 0) {
      setValue(target)
      return
    }

    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const current = from + delta * easeOut(progress)

      fromRef.current = progress < 1 ? current : target
      setValue(progress < 1 ? current : target)

      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
