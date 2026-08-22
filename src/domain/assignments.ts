import type { AssignmentBatch, AssignmentClient, AssignmentFramework, AssignmentsResponse } from '../api/types'

export interface ScopeRow {
  client: AssignmentClient
  batch: AssignmentBatch
}

export interface AssignmentTotals {
  clientCount: number
  questionCount: number
  targetsSet: number
  doneSet: number
  targetFillPct: number | null
}

const share = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : null)

export const frameworkName = (framework: { code: string; name: string | null }) => framework.name ?? framework.code

export function scopeRows(data: AssignmentsResponse, batchId: string, clientId: string): ScopeRow[] {
  return data.clients
    .filter((client) => clientId === 'all' || client.id === clientId)
    .flatMap((client) =>
      client.batches
        .filter((batch) => batchId === 'all' || batch.batchId === batchId)
        .map((batch) => ({ client, batch })),
    )
}

export function frameworkOptions(data: AssignmentsResponse): { value: string; label: string }[] {
  const seen = new Map<string, { order: number; label: string }>()

  for (const client of data.clients)
    for (const batch of client.batches)
      for (const framework of batch.frameworks)
        if (!seen.has(framework.code))
          seen.set(framework.code, {
            order: framework.order,
            label: framework.name ? `${framework.code} · ${framework.name}` : framework.code,
          })

  return [...seen.entries()]
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([value, meta]) => ({ value, label: meta.label }))
}

export function scopeFramework(rows: ScopeRow[], code: string): ScopeRow[] {
  if (code === 'all') return rows

  return rows.flatMap(({ client, batch }) => {
    const frameworks = batch.frameworks.filter((framework) => framework.code === code)
    if (frameworks.length === 0) return []

    const sum = (read: (framework: AssignmentFramework) => number) =>
      frameworks.reduce((total, framework) => total + read(framework), 0)
    const questionCount = sum((framework) => framework.questionCount)
    const targetsSet = sum((framework) => framework.targetsSet)
    const doneSet = sum((framework) => framework.doneSet)

    return [
      {
        client,
        batch: {
          ...batch,
          frameworks,
          frameworkCount: frameworks.length,
          questionCount,
          targetsSet,
          doneSet,
          naCount: sum((framework) => framework.naCount),
          frameworksStarted: frameworks.filter((framework) => framework.targetsSet > 0).length,
          targetFillPct: share(targetsSet, questionCount),
          completionPct: share(doneSet, questionCount),
        },
      },
    ]
  })
}

export function totalsOf(rows: ScopeRow[]): AssignmentTotals {
  const sum = (read: (row: ScopeRow) => number) => rows.reduce((total, row) => total + read(row), 0)
  const questionCount = sum((row) => row.batch.questionCount)
  const targetsSet = sum((row) => row.batch.targetsSet)

  return {
    clientCount: new Set(rows.map((row) => row.client.id)).size,
    questionCount,
    targetsSet,
    doneSet: sum((row) => row.batch.doneSet),
    targetFillPct: share(targetsSet, questionCount),
  }
}

export const detailFrameworks = (rows: ScopeRow[], query: string): AssignmentFramework[] =>
  rows
    .flatMap((row) => row.batch.frameworks)
    .filter((framework) => framework.questions.length > 0)
    .filter((framework) => {
      const needle = query.trim().toLowerCase()
      if (!needle) return true
      return [framework.code, frameworkName(framework), ...framework.questions.map((question) => question.text)].some(
        (field) => field.toLowerCase().includes(needle),
      )
    })
