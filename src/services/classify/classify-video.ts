import { classifyText } from '../../domain/rules/rule-engine.js';
import * as commentsRepo from '../../db/repositories/comments.repo.js';
import * as labelsRepo from '../../db/repositories/labels.repo.js';
import * as videosRepo from '../../db/repositories/videos.repo.js';
import { resolveParsedRuleSet } from './ruleset-resolver.js';
import { buildCommentLabels } from './label-builder.js';

export async function classifyVideo(videoId: string, ruleSetName?: string) {
  const { record, parsed } = await resolveParsedRuleSet(ruleSetName);
  const comments = await commentsRepo.getCommentsByVideoId(videoId);
  const video = await videosRepo.getVideo(videoId);
  const fallbackChannelId = comments[0]?.channelId ?? '';
  const channelId = video?.channelId ?? fallbackChannelId;

  let labeled = 0;
  for (const comment of comments) {
    const matches = classifyText(comment.textOriginal, parsed);
    if (matches.length === 0) continue;

    const labels = buildCommentLabels(
      matches,
      comment.id,
      comment.videoId,
      channelId,
      record,
    );
    await labelsRepo.upsertLabels(labels);
    labeled += labels.length;
  }

  return {
    videoId,
    totalComments: comments.length,
    labelsCreated: labeled,
    ruleSet: record.name,
  };
}
