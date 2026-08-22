import type { ActivityKey, Client, ClientMonth, TabSchema } from '../api/types'
import { gradeOf, percentOf, type Grade } from './scoring'

export const ITEM_MAX = 10

export const ACTIVITY_LABELS: Record<ActivityKey, string> = {
  operationTraining: 'Operation training',
  salesTraining: 'Sales training',
  marketingTraining: 'Marketing training',
  strategicMeeting: 'Strategic meeting',
}

export const META_LABELS = {
  hostinger: 'Hostinger purchase',
  dashboardDataFillup: 'Dashboard data fillup',
} as const

export type MetaKey = keyof typeof META_LABELS

const META_CODES: Record<MetaKey, string> = { hostinger: 'H', dashboardDataFillup: 'D' }

const ACTIVITY_KEYS = Object.keys(ACTIVITY_LABELS) as ActivityKey[]
const META_KEYS = Object.keys(META_LABELS) as MetaKey[]

export interface ScoreSummary {
  /** Sum of the item scores that were actually filled in. */
  scored: number
  /** How many items were actually filled in — the denominator of the average. */
  entered: number
  /** ITEM_MAX for every entered item, so a percent reads as "out of 10". */
  possible: number
  /** The headline reading: the mean of the entered item scores, on the 0-10 scale. */
  average: number | null
  percent: number | null
  grade: Grade | null
}

export type RowKind = 'framework' | 'activity' | 'meta'

export interface BreakdownRow extends ScoreSummary {
  code: string
  name: string
  week: number | null
  month: number | null
  kind: RowKind
}

export interface ProgramSummary extends ScoreSummary {
  clientCount: number
  monthsTracked: number
}

export interface TrendPoint extends ScoreSummary {
  month: number
  label: string
  short: string
}

export interface ActivityRow {
  id: string
  name: string
  values: Record<ActivityKey, number | null>
}

export interface Performer {
  id: string
  name: string
  percent: number | null
}

interface Totals {
  scored: number
  entered: number
}

/**
 * Every item is scored the same way: the two attempts are added and halved,
 * which the API already does, so each item arrives as a single 0-10 number.
 * The average is then just the mean of those numbers over the items that were
 * actually scored. Items nobody has filled in yet are left out entirely rather
 * than counted as zero — an untouched framework is not a failed one.
 */
const summarise = (scored: number, entered: number): ScoreSummary => {
  const possible = entered * ITEM_MAX
  const percent = percentOf(scored, possible)
  return {
    scored: Math.round(scored * 100) / 100,
    entered,
    possible,
    average: entered > 0 ? Math.round((scored / entered) * 100) / 100 : null,
    percent,
    grade: gradeOf(percent),
  }
}

function frameworkTotals(months: ClientMonth[]): Totals {
  let scored = 0
  let entered = 0

  for (const entry of months) {
    for (const framework of entry.frameworks) {
      if (!framework.entered) continue
      scored += framework.score
      entered += 1
    }
  }

  return { scored, entered }
}

function activityTotals(months: ClientMonth[]): Totals {
  let scored = 0
  let entered = 0

  for (const entry of months) {
    for (const key of ACTIVITY_KEYS) {
      const value = entry.activities[key]
      if (value === null || value === undefined) continue
      scored += value
      entered += 1
    }
  }

  return { scored, entered }
}

function metaTotals(months: ClientMonth[]): Totals {
  let scored = 0
  let entered = 0

  for (const entry of months) {
    for (const key of META_KEYS) {
      const value = entry[key]
      if (value === null || value === undefined) continue
      scored += value
      entered += 1
    }
  }

  return { scored, entered }
}

export function summariseMonths(months: ClientMonth[]): ScoreSummary {
  const parts = [frameworkTotals(months), activityTotals(months), metaTotals(months)]
  return summarise(
    parts.reduce((total, part) => total + part.scored, 0),
    parts.reduce((total, part) => total + part.entered, 0),
  )
}

const inScope = (client: Client, month: number | null) =>
  client.months.filter((entry) => month === null || entry.month === month)

export const summariseClient = (client: Client, month: number | null = null) =>
  summariseMonths(inScope(client, month))

export const frameworksEnteredIn = (client: Client, month: number | null) =>
  inScope(client, month).reduce(
    (total, entry) => total + entry.frameworks.filter((framework) => framework.entered).length,
    0,
  )

function monthsInScope(clients: Client[], month: number | null): number[] {
  const seen = new Set<number>()
  for (const client of clients) {
    for (const entry of client.months) {
      if (month === null || entry.month === month) seen.add(entry.month)
    }
  }
  return [...seen].sort((a, b) => a - b)
}

export function programSummary(clients: Client[], month: number | null): ProgramSummary {
  const months = clients.flatMap((client) => inScope(client, month))

  return {
    ...summariseMonths(months),
    clientCount: new Set(clients.map((client) => client.id)).size,
    monthsTracked: new Set(months.map((entry) => entry.month)).size,
  }
}

export function frameworkRollup(clients: Client[], month: number | null): BreakdownRow[] {
  const buckets = new Map<string, { name: string; week: number; month: number; scored: number; entered: number }>()

  for (const client of clients) {
    for (const entry of inScope(client, month)) {
      for (const framework of entry.frameworks) {
        // The row exists as soon as the column does, so a framework nobody has
        // reached yet still lists — it just reads "—" instead of 0%.
        const bucket = buckets.get(framework.code) ?? {
          name: framework.name,
          week: framework.week,
          month: entry.month,
          scored: 0,
          entered: 0,
        }
        if (framework.entered) {
          bucket.scored += framework.score
          bucket.entered += 1
        }
        buckets.set(framework.code, bucket)
      }
    }
  }

  return Array.from(buckets, ([code, bucket]) => ({
    code,
    name: bucket.name,
    week: bucket.week,
    month: bucket.month,
    kind: 'framework' as const,
    ...summarise(bucket.scored, bucket.entered),
  })).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
}

function optionalRollup<K extends string>(
  clients: Client[],
  month: number | null,
  keys: K[],
  read: (entry: ClientMonth, key: K) => number | null | undefined,
  label: (key: K) => string,
  code: (key: K, index: number, current: number) => string,
  kind: RowKind,
): BreakdownRow[] {
  return monthsInScope(clients, month).flatMap((current) =>
    keys.map((key, index) => {
      let scored = 0
      let entered = 0

      for (const client of clients) {
        for (const entry of client.months) {
          if (entry.month !== current) continue
          const value = read(entry, key)
          if (value === null || value === undefined) continue
          scored += value
          entered += 1
        }
      }

      return {
        code: code(key, index, current),
        name: label(key),
        week: null,
        month: current,
        kind,
        ...summarise(scored, entered),
      }
    }),
  )
}

export const activityRollup = (clients: Client[], month: number | null) =>
  optionalRollup(
    clients,
    month,
    ACTIVITY_KEYS,
    (entry, key) => entry.activities[key],
    (key) => ACTIVITY_LABELS[key],
    (key, index, current) => (key === 'strategicMeeting' ? `M${current}` : `T${(current - 1) * 3 + index + 1}`),
    'activity',
  )

export const metaRollup = (clients: Client[], month: number | null) =>
  optionalRollup(
    clients,
    month,
    META_KEYS,
    (entry, key) => entry[key],
    (key) => META_LABELS[key],
    (key, _index, current) => `${META_CODES[key]}${current}`,
    'meta',
  )

export function performanceTrend(clients: Client[], schema: TabSchema[]): TrendPoint[] {
  return [...schema]
    .sort((a, b) => a.month - b.month)
    .map((tab) => ({
      month: tab.month,
      label: tab.chakra || tab.tab,
      short: `C${tab.month}`,
      ...summariseMonths(clients.flatMap((client) => client.months).filter((entry) => entry.month === tab.month)),
    }))
}

export const chakraOptions = (schema: TabSchema[]) =>
  [...schema]
    .sort((a, b) => a.month - b.month)
    .map((tab) => ({ value: String(tab.month), label: tab.chakra || tab.tab }))

export const matchesQuery = (query: string, ...fields: string[]) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => field.toLowerCase().includes(needle))
}

export const rankClients = (clients: Client[]): Client[] =>
  [...clients].sort((a, b) => (summariseClient(b).percent ?? -1) - (summariseClient(a).percent ?? -1))

export function activityMatrix(clients: Client[], month: number | null): ActivityRow[] {
  return clients
    .map((client) => {
      const months = inScope(client, month)
      const values = {} as Record<ActivityKey, number | null>

      for (const key of ACTIVITY_KEYS) {
        let latest: number | null = null
        for (const entry of months) {
          const value = entry.activities[key]
          if (value !== null && value !== undefined) latest = value
        }
        values[key] = latest
      }

      return { id: client.id, name: client.name, values }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function performers(clients: Client[], count: number) {
  const scored = rankClients(clients)
    .filter((client) => summariseClient(client).possible > 0)
    .map((client) => ({ id: client.id, name: client.name, percent: summariseClient(client).percent }))

  return { top: scored.slice(0, count), bottom: scored.slice(-count).reverse() }
}
