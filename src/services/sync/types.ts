export interface SyncChannelOptions {
  channelId: string;
  days?: number;
  maxVideos?: number;
  maxCommentsPerVideo?: number;
  dryRun?: boolean;
}

export interface SyncVideoOptions {
  videoId: string;
  channelId?: string;
  maxComments?: number;
  dryRun?: boolean;
}

export interface SyncRangeOptions {
  channelId: string;
  from: Date;
  to: Date;
  maxVideos?: number;
  maxCommentsPerVideo?: number;
  dryRun?: boolean;
}
