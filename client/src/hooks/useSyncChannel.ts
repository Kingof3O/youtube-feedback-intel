import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  postSyncChannel,
  type SyncChannelRequest,
} from '../lib/api/channels.api';

export function useSyncChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SyncChannelRequest) => postSyncChannel(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['channels'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
      ]);
    },
  });
}
