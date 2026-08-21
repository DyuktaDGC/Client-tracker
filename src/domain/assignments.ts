import type { AssignmentBatch, AssignmentClient, AssignmentFramework, AssignmentsResponse } from '../api/types'
import { gradeOf, type Grade } from './scoring'

export interface ScopeRow {
  client: AssignmentClient
  batch: AssignmentBatch
}

export interface AssignmentTotals {
  clientCount: number
  frameworkCount: number
  questionCount: number
  targetsSet: number
  doneSet: number
  targetFillPct: number | null
  completionPct: number | null
  grade: Grade | null
}

export interface FrameworkRow {
  code: string
  name: string
  questionCount: number
  targetsSet: number
  doneSet: number
  completionPct: number | null
}

const mean = (values: number[]) =>
  values.length ? Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10 : null

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

export function totalsOf(rows: ScopeRow[]): AssignmentTotals {
  const sum = (read: (row: ScopeRow) => number) => rows.reduce((total, row) => total + read(row), 0)
  const questionCount = sum((row) => row.batch.questionCount)
  const targetsSet = sum((row) => row.batch.targetsSet)
  const completionPct = mean(
    rows.map((row) => row.batch.completionPct).filter((value): value is number => value !== null),
  )

  return {
    clientCount: new Set(rows.map((row) => row.client.id)).size,
    frameworkCount: new Set(rows.flatMap((row) => row.batch.frameworks.map((framework) => framework.code))).size,
    questionCount,
    targetsSet,
    doneSet: sum((row) => row.batch.doneSet),
    targetFillPct: share(targetsSet, questionCount),
    completionPct,
    grade: gradeOf(completionPct),
  }
}

export function frameworkRollup(rows: ScopeRow[]): FrameworkRow[] {
  const buckets = new Map<string, FrameworkRow & { scores: number[] }>()

  for (const { batch } of rows) {
    for (const framework of batch.frameworks) {
      const bucket = buckets.get(framework.code) ?? {
        code: framework.code,
        name: frameworkName(framework),
        questionCount: 0,
        targetsSet: 0,
        doneSet: 0,
        completionPct: null,
        scores: [],
      }
      bucket.name = frameworkName(framework)
      bucket.questionCount += framework.questionCount
      bucket.targetsSet += framework.targetsSet
      bucket.doneSet += framework.doneSet
      if (framework.completionPct !== null) bucket.scores.push(framework.completionPct)
      buckets.set(framework.code, bucket)
    }
  }

  return [...buckets.values()]
    .filter((bucket) => bucket.questionCount > 0)
    .map(({ scores, ...row }) => ({ ...row, completionPct: mean(scores) }))
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
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
