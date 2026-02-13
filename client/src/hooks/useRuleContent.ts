import { useMutation } from '@tanstack/react-query';
import { fetchRuleContent, saveRuleContent } from '../lib/api/rules.api';

export function useFetchRuleContent() {
  return useMutation({
    mutationFn: async (name: string) => fetchRuleContent(name),
  });
}

export function useSaveRuleContent() {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      content: string;
      format: 'yaml' | 'json';
    }) => saveRuleContent(payload.name, payload),
  });
}
