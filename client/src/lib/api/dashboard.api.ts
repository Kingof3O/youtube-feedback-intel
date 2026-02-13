import { getJson } from './http';
import type { DashboardStats } from './types';

export function fetchDashboardStats(): Promise<DashboardStats> {
  return getJson<DashboardStats>('/api/dashboard');
}
