export type Grade = 'A' | 'B' | 'C'
export type Band = 'high' | 'good' | 'fair' | 'low' | 'none'

export const GRADE_SCALE: ReadonlyArray<{ grade: Grade; min: number }> = [
  { grade: 'A', min: 80 },
  { grade: 'B', min: 50 },
  { grade: 'C', min: 0 },
]

export const BAND_THRESHOLDS = { high: 80, good: 50, fair: 35 } as const

export function percentOf(scored: number, possible: number): number | null {
  if (!Number.isFinite(scored) || !Number.isFinite(possible) || possible <= 0) return null
  return Math.round((scored / possible) * 1000) / 10
}

export function gradeOf(percent: number | null): Grade | null {
  if (percent === null || !Number.isFinite(percent)) return null
  return GRADE_SCALE.find((entry) => percent >= entry.min)?.grade ?? 'C'
}

export function bandOf(percent: number | null): Band {
  if (percent === null || !Number.isFinite(percent)) return 'none'
  if (percent >= BAND_THRESHOLDS.high) return 'high'
  if (percent >= BAND_THRESHOLDS.good) return 'good'
  if (percent >= BAND_THRESHOLDS.fair) return 'fair'
  return 'low'
}
