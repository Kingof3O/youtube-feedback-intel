export interface DashboardStats {
  channels: number;
  videos: number;
  comments: number;
  feedback: number;
}

export interface Channel {
  id: string;
  title: string;
  custom_url: string;
  thumbnail_url: string;
  subscriber_count: number;
  video_count: number;
  last_synced_at: string | null;
}

export interface RuleSet {
  name: string;
  version: string;
  rulesHash: string;
  isActive: boolean;
  createdAt: string;
}

export interface RuleFileContent {
  name: string;
  format: 'yaml' | 'json';
  content: string;
}

export interface FeedbackItem {
  videoTitle: string;
  videoId: string;
  commentId: string;
  text: string;
  author: string;
  likes: number;
  date: string;
  labels: Array<{
    category: string;
    score: number;
    keywords: string[];
    lang: string;
  }>;
}

export interface FeedbackQuery {
  search?: string;
  category?: string;
  minLikes?: string;
  mode: 'classified' | 'all';
  limit: number;
  offset: number;
}
