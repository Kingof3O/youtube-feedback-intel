export interface Category {
  score: number;
  keywords: Record<string, string[]>;
}

export interface RuleConfig {
  ruleSet: {
    name: string;
    version: string;
    languages: string[];
    global: {
      minScore: number;
      negativeKeywords: string[];
    };
    categories: Record<string, Category>;
  };
}
