const rawBase = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const API_BASE_URL = rawBase.replace(/\/+$/, '')
export const REQUEST_TIMEOUT_MS = 20_000
export const STALE_TIME_MS = 60_000
export const AUTO_REFRESH_MS = 5 * 60_000
export const RETRY_ATTEMPTS = 2
