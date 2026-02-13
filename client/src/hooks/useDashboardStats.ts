import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../lib/api/dashboard.api';
import type { DashboardStats } from '../lib/api/types';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });
}
