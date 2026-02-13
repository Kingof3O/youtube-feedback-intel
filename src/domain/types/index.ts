/* ─── Domain DTOs ─── */

export interface Channel {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  uploadsPlaylistId: string;
  subscriberCount?: number;
  videoCount?: number;
  viewCount?: number;
  thumbnailUrl?: string;
  fetchedAt: string;
}

export interface Video {
  id: string;
  channelId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  duration?: string;
  tags?: string[];
  lastSyncedAt?: string;
  fetchedAt: string;
}

export interface CommentThread {
  id: string;
  videoId: string;
  channelId: string;
  topLevelCommentId: string;
  totalReplyCount: number;
  fetchedAt: string;
}

export interface Comment {
  id: string;
  threadId: string;
  videoId: string;
  channelId: string;
  authorDisplayName: string;
  authorChannelId?: string;
  textOriginal: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  isReply: boolean;
  parentId?: string;
  fetchedAt: string;
}

export interface CommentLabel {
  id?: number;
  commentId: string;
  videoId: string;
  channelId: string;
  category: string;
  score: number;
  matchedKeywords: string[];
  matchedLanguage: string;
  ruleSetName: string;
  ruleSetVersion: string;
  ruleSetHash: string;
  labeledAt: string;
}

export interface RuleSetRecord {
  id?: number;
  name: string;
  version: string;
  rulesJson: string;
  rulesHash: string;
  isActive: boolean;
  createdAt?: string;
}

export interface SyncState {
  id?: number;
  entityType: 'channel' | 'video';
  entityId: string;
  lastPageToken?: string;
  lastSyncedAt?: string;
  itemsSynced: number;
}

export interface FeedbackResult {
  comment: Comment;
  labels: CommentLabel[];
  videoTitle: string;
}

export interface ReportData {
  channelId: string;
  channelTitle: string;
  since: string;
  until: string;
  totalComments: number;
  totalFeedback: number;
  categorySummary: Record<string, number>;
  items: FeedbackResult[];
}
