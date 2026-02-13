import type { Request, Response, NextFunction } from 'express';
import { syncChannel } from '../../services/sync.service.js';

interface SyncChannelBody {
  channelId?: string;
  days?: number | string;
  maxVideos?: number | string;
  maxCommentsPerVideo?: number | string;
}

export async function syncChannelHandler(
  req: Request<unknown, unknown, SyncChannelBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { channelId, days, maxVideos, maxCommentsPerVideo } = req.body;
    const result = await syncChannel({
      channelId: channelId ?? '',
      days: days ? Number(days) : undefined,
      maxVideos: maxVideos ? Number(maxVideos) : undefined,
      maxCommentsPerVideo: maxCommentsPerVideo
        ? Number(maxCommentsPerVideo)
        : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
