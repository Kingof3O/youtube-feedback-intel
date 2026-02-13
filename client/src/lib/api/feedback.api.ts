import { getJson } from './http';
import type { FeedbackItem, FeedbackQuery } from './types';

export interface FeedbackPage {
  items: FeedbackItem[];
  nextCursor?: number;
}

export async function fetchFeedbackPage(query: FeedbackQuery): Promise<FeedbackPage> {
  const params = new URLSearchParams({
    limit: String(query.limit),
    offset: String(query.offset),
    mode: query.mode,
  });

  if (query.search) params.append('search', query.search);
  if (query.category && query.mode === 'classified') {
    params.append('category', query.category);
  }
  if (query.minLikes) params.append('minLikes', query.minLikes);

  const items = await getJson<FeedbackItem[]>(`/api/feedback?${params.toString()}`);
  return {
    items,
    nextCursor: items.length === query.limit ? query.offset + query.limit : undefined,
  };
}
