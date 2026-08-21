export type WarningLevel = 'error' | 'warn' | 'info'

export interface ApiWarning {
  level: WarningLevel
  message: string
  tab?: string
  client?: string
  column?: string
  framework?: string
  question?: string
  row?: number
}

export interface WarningCounts {
  error: number
  warn: number
  info: number
}

export interface TabSchema {
  tab: string
  month: number
  chakra: string
  frameworkCount: number
  frameworkCodes: string[]
  activityColumns: string[]
  unknownColumns: string[]
  rowsRead: number
}

export interface FrameworkScore {
  code: string
  name: string
  week: number
  a1: number | null
  a2: number | null
  score: number
  entered: boolean
  maxScore: number
}

export interface Activities {
  operationTraining: number | null
  salesTraining: number | null
  marketingTraining: number | null
  strategicMeeting: number | null
}

export type ActivityKey = keyof Activities

export interface ClientMonth {
  month: number
  chakra: string
  sheet: string
  frameworks: FrameworkScore[]
  activities: Activities
  monthScored: number
  monthPossible: number
  hostinger: number | null
  dashboardDataFillup: number | null
}

export interface Client {
  id: string
  srNo: number | null
  name: string
  startDate: string | null
  performance: number | null
  totalScored: number
  totalPossible: number
  programPerformance: number | null
  programTotalPossible: number
  frameworksEntered: number
  months: ClientMonth[]
}

export interface DashboardResponse {
  syncedAt: string
  clientCount: number
  frameworkCount: number
  clients: Client[]
  schema: TabSchema[]
  warnings: ApiWarning[]
  warningCounts: WarningCounts
}


export interface AssignmentQuestion {
  qid: string
  no: number
  text: string
  unit: 'count' | 'percent'
  target: number | null
  done: number | null
  na: boolean
  achievementPct: number | null
}

export interface AssignmentFramework {
  code: string
  name: string | null
  order: number
  questions: AssignmentQuestion[]
  questionCount: number
  targetsSet: number
  doneSet: number
  naCount: number
  completionPct: number | null
}

export interface AssignmentBatch {
  batchId: string
  label: string
  periodStart: string
  periodEnd: string
  tab: string
  frameworks: AssignmentFramework[]
  frameworkCount: number
  questionCount: number
  targetsSet: number
  doneSet: number
  naCount: number
  frameworksStarted: number
  targetFillPct: number | null
  completionPct: number | null
}

export interface AssignmentClient {
  id: string
  name: string
  batches: AssignmentBatch[]
  batchCount: number
  latestBatchId: string | null
  frameworkCount: number
  questionCount: number
  targetsSet: number
  doneSet: number
  targetFillPct: number | null
  completionPct: number | null
  completionPctAllBatches: number | null
}

export interface AssignmentBatchMeta {
  batchId: string
  label: string
  periodStart: string
  periodEnd: string
  tab: string
  clientCount: number
  frameworkCount: number
  questionCount: number
  frameworkCodes: string[]
}

export interface AssignmentsResponse {
  syncedAt: string
  clientCount: number
  batchCount: number
  frameworkCount: number
  frameworkCodes: string[]
  batches: AssignmentBatchMeta[]
  clients: AssignmentClient[]
  warnings: ApiWarning[]
  warningCounts: WarningCounts
}
