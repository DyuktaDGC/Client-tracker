import { REQUEST_TIMEOUT_MS } from '../api/config'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function parse(body: string): unknown {
  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}

function messageFrom(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    for (const key of ['message', 'error'] as const) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value
    }
  }
  return fallback
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), REQUEST_TIMEOUT_MS)
  signal?.addEventListener('abort', () => controller.abort(signal.reason), { once: true })

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError'
    throw new ApiError(0, timedOut ? 'The dashboard took too long to respond.' : 'Could not reach the dashboard API.')
  } finally {
    clearTimeout(timer)
  }

  const data = parse(await response.text())
  if (!response.ok) throw new ApiError(response.status, messageFrom(data, `Request failed (${response.status}).`))
  if (data === null) throw new ApiError(response.status, 'The dashboard API returned an unreadable response.')
  return data as T
}
