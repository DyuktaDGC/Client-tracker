export const config = { runtime: 'edge' }

const ROUTES: Record<string, readonly string[]> = {
  dashboard: [],
  clients: [],
  client: ['id'],
  health: [],
  assignments: [],
}

const UPSTREAM: Record<string, string> = {
  assignments: 'dgc/data?view=dashboard',
}

const ID_PATTERN = /^[a-z0-9-]{1,120}$/

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return fail(405, 'Method not allowed.')

  const base = process.env.N8N_BASE_URL?.replace(/\/+$/, '')
  const headerName = process.env.N8N_HEADER_NAME
  const headerValue = process.env.N8N_HEADER_VALUE
  if (!base) return fail(500, 'The dashboard API is not configured.')

  const incoming = new URL(request.url)
  const route = incoming.pathname.replace(/^\/api\//, '').replace(/\/+$/, '')
  const allowedParams = ROUTES[route]
  if (!allowedParams) return fail(404, 'Unknown endpoint.')

  const target = new URL(`${base}/${UPSTREAM[route] ?? route}`)
  for (const key of allowedParams) {
    const value = incoming.searchParams.get(key)
    if (value === null) continue
    if (!ID_PATTERN.test(value)) return fail(400, 'Invalid request parameter.')
    target.searchParams.set(key, value)
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(headerName && headerValue ? { [headerName]: headerValue } : {}),
      },
      signal: AbortSignal.timeout(25_000),
    })
  } catch {
    return fail(504, 'The tracker did not respond in time.')
  }

  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}
