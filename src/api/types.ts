export type WarningLevel = 'error' | 'warn' | 'info'

export interface ApiWarning {
  level: WarningLevel
  message: string
  tab?: string
  client?: string
  column?: string
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

