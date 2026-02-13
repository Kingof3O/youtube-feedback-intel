export interface QueryOptions {
  channelId?: string;
  videoId?: string;
  category?: string;
  contains?: string;
  minLikes?: number;
  since?: string;
  until?: string;
  limit?: number;
  offset?: number;
  mode?: 'classified' | 'all';
}
