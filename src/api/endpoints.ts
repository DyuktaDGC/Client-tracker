import { getJson } from '../lib/http'
import { API_BASE_URL } from './config'
import type { AssignmentsResponse, DashboardResponse } from './types'

export const fetchDashboard = (signal?: AbortSignal) =>
  getJson<DashboardResponse>(`${API_BASE_URL}/dashboard`, signal)

export const fetchAssignments = (signal?: AbortSignal) =>
  getJson<AssignmentsResponse>(`${API_BASE_URL}/dgc/data?view=dashboard`, signal)
