import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '../hooks/useIntersection';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useFeedbackInfinite } from '../hooks/useFeedbackInfinite';
import { ExplorerFilters } from '../components/explorer/ExplorerFilters';
import { FeedbackCard } from '../components/explorer/FeedbackCard';
import type { FeedbackItem } from '../lib/api/types';

const categories = [
  'bug',
  'performance',
  'ui_ux',
  'feature_request',
  'integration',
  'development',
];

export function Explorer() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minLikes, setMinLikes] = useState('0');
  const [viewMode, setViewMode] = useState<'classified' | 'all'>('classified');

  const debouncedSearch = useDebouncedValue(search);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFeedbackInfinite({
    search: debouncedSearch,
    category,
    minLikes,
    mode: viewMode,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(loadMoreRef, { threshold: 0.5 });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="fade-in flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4 sticky top-0 bg-bg-primary z-10 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">Feedback Explorer</h2>
            <p className="text-sm text-muted">
              Search and filter classified comments.
            </p>
          </div>
        </div>

        <ExplorerFilters
          search={search}
          category={category}
          minLikes={minLikes}
          viewMode={viewMode}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onMinLikesChange={setMinLikes}
          onViewModeChange={setViewMode}
        />
      </div>

      <div className="flex flex-col gap-4 pb-8">
        {isLoading ? (
          <div className="text-center p-8 text-muted">
            <span className="spinner" />
          </div>
        ) : data?.pages[0].items.length === 0 ? (
          <div className="text-center p-12 text-muted border border-dashed border-white/10 rounded-lg">
            No feedback found matching your filters.
          </div>
        ) : (
          data?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="flex flex-col gap-4">
              {page.items.map((item: FeedbackItem, itemIndex: number) => (
                <FeedbackCard key={`${item.commentId}-${itemIndex}`} item={item} />
              ))}
            </div>
          ))
        )}
        <div ref={loadMoreRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="text-center p-4">
            <span className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
}
