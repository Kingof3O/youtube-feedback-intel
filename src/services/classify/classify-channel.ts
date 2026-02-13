import { classifyText } from '../../domain/rules/rule-engine.js';
import * as commentsRepo from '../../db/repositories/comments.repo.js';
import * as labelsRepo from '../../db/repositories/labels.repo.js';
import { logger } from '../../utils/logger.js';
import { buildCommentLabels } from './label-builder.js';
import { resolveParsedRuleSet } from './ruleset-resolver.js';

export async function classifyChannel(channelId: string, ruleSetName?: string) {
  const { record, parsed } = await resolveParsedRuleSet(ruleSetName);
  const comments = await commentsRepo.getCommentsByChannelId(channelId);

  logger.info(
    { channelId, commentCount: comments.length, ruleSet: record.name },
    'Classifying channel comments',
  );

  let labeled = 0;
  for (const comment of comments) {
    const matches = classifyText(comment.textOriginal, parsed);
    if (matches.length === 0) continue;

    const labels = buildCommentLabels(
      matches,
      comment.id,
      comment.videoId,
      comment.channelId,
      record,
    );
    await labelsRepo.upsertLabels(labels);
    labeled += labels.length;
  }

  const summary = {
    channelId,
    totalComments: comments.length,
    labelsCreated: labeled,
    ruleSet: record.name,
  };
  logger.info(summary, 'Classification complete');
  return summary;
}
