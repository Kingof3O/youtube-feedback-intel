import { z } from 'zod';

const languageCode = z.enum(['ar', 'en', 'fr', 'es', 'de']);

export type LanguageCode = z.infer<typeof languageCode>;

const keywordMap = z.record(z.string(), z.array(z.string()));

const categorySchema = z.object({
  score: z.number().int().positive(),
  keywords: keywordMap,
});

export const ruleSetSchema = z.object({
  ruleSet: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    languages: z.array(languageCode).min(1),
    global: z.object({
      minScore: z.number().int().nonnegative().default(1),
      negativeKeywords: z.array(z.string()).default([]),
    }),
    categories: z.record(z.string(), categorySchema),
  }),
});

export type RuleSetConfig = z.infer<typeof ruleSetSchema>;
export type CategoryConfig = z.infer<typeof categorySchema>;
