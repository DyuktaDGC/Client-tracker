# DGC Client Performance Dashboard

Single-page React + TypeScript + Vite frontend for the n8n `DGC Client Performance Dashboard` workflow.

## Architecture

```
api/[...path].ts             Vercel edge proxy — injects the n8n auth header server-side
src/api/                     every network call (config, endpoints, query keys, hooks, types)
src/domain/                  pure scoring + selector logic, no React
src/components/ui/           primitives — DataTable, Meter, Badge, ScoreChip, Select, states
src/components/dashboard/    headline, coverage and spotlight cards
src/components/layout/       shell, top bar, filter bar, section card, error boundary
src/features/dashboard/      framework table, training activity table, performer lists
src/pages/DashboardPage.tsx  the page
src/app/                     providers, query client, router
```

UI is presentational only. Anything that computes a percentage, grade or ranking lives in
`src/domain`. Anything that talks to the network lives in `src/api`.

## The page

1. Filter bar — chakra dropdown, client dropdown, search, clear (appears only when a filter is set).
2. Three summary cards — program average with grade, coverage tiles, client spotlight.
3. Framework breakdown — sortable, scrollable table. Every header sorts; click again to reverse.
4. Bottom row — training activity per client, top performers, needs improvement.

Filters scope the whole page. Chakra filters by month tab, client narrows to one business,
search matches framework code/name and client name.

## Endpoints

| Route | n8n webhook | Used by |
| --- | --- | --- |
| `/api/dashboard` | `/dashboard` | the page |
| `/api/clients` | `/clients` | available via `useClients()` |
| `/api/client?id=<slug>` | `/client` | available via `useClient(id)` |
| `/api/health` | `/health` | available via `useHealth()` |

## Environment

Copy `.env.example` to `.env` and fill in:

```
N8N_BASE_URL=https://<your-n8n-host>/webhook
N8N_HEADER_NAME=<header auth name>
N8N_HEADER_VALUE=<header auth value>
```

Server-side only — never bundled into the client. In dev, Vite proxies `/api` to n8n and
attaches the header. In production the same variables must be set as Vercel project
environment variables, where the edge function uses them. Restart the dev server after
changing `.env`.

`VITE_API_BASE_URL` is optional and only needed if the API is served from somewhere
other than `/api`.

## Scripts

```
npm install
npm run dev
npm run build
npm run lint
```

## State

- Server state: TanStack Query (60s stale, 5 min auto refresh, retry with backoff, no retry on 4xx).
- UI state: URL search params, so a filtered view is shareable and survives reload.
- Table sort state is local to each table.

## Grading

`src/domain/scoring.ts` holds `GRADE_SCALE` and `BAND_THRESHOLDS` (the meter colour bands).
Change the numbers there and every card, badge and meter follows.

## Adding a page later

The router already renders through a shell layout. Add a file under `src/pages/`, register
one lazy route in `src/app/router.tsx`, and add a nav element to `src/components/layout/TopBar.tsx`.
