import { getJson, postJson } from './http';
import type { Channel } from './types';

export interface SyncChannelRequest {
  channelId: string;
  days: number;
  maxVideos?: number;
  maxCommentsPerVideo?: number;
}

export function fetchChannels(): Promise<Channel[]> {
  return getJson<Channel[]>('/api/channels');
}

export function postSyncChannel(body: SyncChannelRequest): Promise<unknown> {
  return postJson<unknown>('/api/sync/channel', body);
}
