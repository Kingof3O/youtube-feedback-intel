import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedbackPage } from '../lib/api/feedback.api';

interface FeedbackInfiniteOptions {
  search: string;
  category: string;
  minLikes: string;
  mode: 'classified' | 'all';
}

export function useFeedbackInfinite(options: FeedbackInfiniteOptions) {
  return useInfiniteQuery({
    queryKey: [
      'feedback',
      options.search,
      options.category,
      options.minLikes,
      options.mode,
    ],
    queryFn: async ({ pageParam = 0 }) =>
      fetchFeedbackPage({
        search: options.search,
        category: options.category,
        minLikes: options.minLikes,
        mode: options.mode,
        limit: 20,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
