import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  activateRule,
  fetchRules,
  importDefaultRules,
} from '../lib/api/rules.api';

export function useRules() {
  return useQuery({
    queryKey: ['rules'],
    queryFn: fetchRules,
  });
}

export function useActivateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => activateRule(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}

export function useImportDefaultRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importDefaultRules,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
}
