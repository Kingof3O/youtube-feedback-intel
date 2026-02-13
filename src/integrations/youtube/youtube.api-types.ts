export interface YouTubePageInfo {
  totalResults?: number;
}

export interface ChannelApiSnippet {
  title: string;
  description?: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails?: {
    default?: { url?: string };
  };
}

export interface ChannelApiItem {
  id: string;
  snippet: ChannelApiSnippet;
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
    viewCount?: string;
  };
}

export interface ChannelApiResponse {
  items?: ChannelApiItem[];
}

export interface PlaylistItemApi {
  contentDetails: {
    videoId: string;
  };
}

export interface PlaylistItemsApiResponse {
  items?: PlaylistItemApi[];
  nextPageToken?: string;
  pageInfo?: YouTubePageInfo;
}

export interface VideoApiSnippet {
  channelId: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnails?: {
    medium?: { url?: string };
    default?: { url?: string };
  };
  tags?: string[];
}

export interface VideoApiItem {
  id: string;
  snippet: VideoApiSnippet;
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface VideosApiResponse {
  items?: VideoApiItem[];
}

export interface AuthorChannelId {
  value?: string;
}

export interface CommentApiSnippet {
  authorDisplayName?: string;
  authorChannelId?: AuthorChannelId;
  textOriginal?: string;
  textDisplay?: string;
  likeCount?: number;
  publishedAt: string;
  updatedAt?: string;
}

export interface CommentApiItem {
  id: string;
  snippet: CommentApiSnippet;
}

export interface CommentThreadApiSnippet {
  videoId: string;
  totalReplyCount?: number;
  topLevelComment: CommentApiItem;
}

export interface CommentThreadApiItem {
  id: string;
  snippet: CommentThreadApiSnippet;
  replies?: {
    comments?: CommentApiItem[];
  };
}

export interface CommentThreadsApiResponse {
  items?: CommentThreadApiItem[];
  nextPageToken?: string;
}
