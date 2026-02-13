import { nowISO } from '../../utils/time.js';
import type { MatchResult } from '../../domain/rules/rule-types.js';
import type { CommentLabel, RuleSetRecord } from '../../domain/types/index.js';

export function buildCommentLabels(
  matches: MatchResult[],
  commentId: string,
  videoId: string,
  channelId: string,
  ruleSet: RuleSetRecord,
): CommentLabel[] {
  return matches.map((m) => ({
    commentId,
    videoId,
    channelId,
    category: m.category,
    score: m.score,
    matchedKeywords: m.matchedKeywords,
    matchedLanguage: m.matchedLanguage,
    ruleSetName: ruleSet.name,
    ruleSetVersion: ruleSet.version,
    ruleSetHash: ruleSet.rulesHash,
    labeledAt: nowISO(),
  }));
}
