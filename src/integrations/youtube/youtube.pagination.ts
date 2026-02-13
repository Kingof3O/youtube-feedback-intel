/**
 * Generic paginated response helper.
 */
export interface PaginatedResult<T> {
  items: T[];
  nextPageToken?: string;
  totalResults?: number;
}
