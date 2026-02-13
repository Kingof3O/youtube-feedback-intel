import type { Request, Response, NextFunction } from 'express';
import { queryFeedback } from '../../services/query.service.js';
import { mapFeedbackResultsToApi } from '../mappers/feedback-response.mapper.js';

interface FeedbackQuery {
  channelId?: string;
  videoId?: string;
  category?: string;
  search?: string;
  minLikes?: string;
  since?: string;
  until?: string;
  limit?: string;
  offset?: string;
  mode?: 'classified' | 'all';
}

export async function getFeedback(
  req: Request<unknown, unknown, unknown, FeedbackQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      channelId,
      videoId,
      category,
      search,
      minLikes,
      since,
      until,
      limit,
      offset,
      mode,
    } = req.query;

    const results = await queryFeedback({
      channelId,
      videoId,
      category,
      contains: search,
      minLikes: minLikes ? Number(minLikes) : undefined,
      since,
      until,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      mode,
    });

    res.json(mapFeedbackResultsToApi(results));
  } catch (err) {
    next(err);
  }
}
