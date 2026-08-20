import { getJson } from '../lib/http'
import { API_BASE_URL } from './config'
import type { DashboardResponse } from './types'

export const fetchDashboard = (signal?: AbortSignal) =>
  getJson<DashboardResponse>(`${API_BASE_URL}/dashboard`, signal)
