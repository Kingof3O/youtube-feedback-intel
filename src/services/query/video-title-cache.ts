import * as videosRepo from '../../db/repositories/videos.repo.js';

export class VideoTitleCache {
  private cache = new Map<string, string>();

  async get(videoId: string): Promise<string> {
    const existing = this.cache.get(videoId);
    if (existing) return existing;

    const video = await videosRepo.getVideo(videoId);
    const title = video?.title ?? 'Unknown Video';
    this.cache.set(videoId, title);
    return title;
  }
}
