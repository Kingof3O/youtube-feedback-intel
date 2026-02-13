import { useQuery } from '@tanstack/react-query';
import { fetchChannels } from '../lib/api/channels.api';
import type { Channel } from '../lib/api/types';

export function useChannels() {
  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  });
}
