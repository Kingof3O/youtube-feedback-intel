import { Globe, Layers, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../ui/Button';
import { TagInput } from '../../ui/TagInput';
import type { RuleConfig } from './types';

interface CategoryKeywordsPanelProps {
  parsed: RuleConfig;
  activeCategory: string | null;
  activeLang: string;
  onCategoryScoreChange: (category: string, value: string) => void;
  onLanguageChange: (lang: string) => void;
  onKeywordsChange: (tags: string[]) => void;
  onDeleteCategory: (category: string) => void;
}

export function CategoryKeywordsPanel({
  parsed,
  activeCategory,
  activeLang,
  onCategoryScoreChange,
  onLanguageChange,
  onKeywordsChange,
  onDeleteCategory,
}: CategoryKeywordsPanelProps) {
  if (!activeCategory) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted gap-6 p-12 text-center">
        <div className="p-8 bg-black/40 rounded-full border border-white/5 shadow-2xl">
          <Layers size={64} className="opacity-20 animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Segment Logic Configuration
          </h3>
          <p className="max-w-sm mx-auto">
            Select a category from the sidebar to refine its classification rules
            and scoring weights.
          </p>
        </div>
      </div>
    );
  }

  const active = parsed.ruleSet.categories[activeCategory];

  return (
    <>
      <div className="p-8 border-b border-white/5 bg-black/40">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">
              {activeCategory}
            </h2>
            <p className="text-base text-muted opacity-70 font-medium">
              Configure rules and weighted keywords for this segment.
            </p>
          </div>
          <div className="flex items-center gap-6 bg-black/60 p-3 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 px-3">
              <label className="text-xs font-bold text-muted uppercase tracking-widest opacity-60">
                Weight Score
              </label>
              <input
                type="number"
                className="bg-black/60 border border-white/10 focus:border-accent-primary/50 focus:ring-4 focus:ring-accent-primary/10 rounded-xl px-4 py-2 text-xl text-white w-24 text-center font-black font-mono transition-all shadow-inner"
                value={active.score}
                onChange={(event) =>
                  onCategoryScoreChange(activeCategory, event.target.value)
                }
              />
            </div>
            <div className="h-10 w-px bg-white/10" />
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteCategory(activeCategory)}
              title="Delete Segment"
              className="!p-3 shadow-lg group"
            >
              <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 p-8">
        <div className="flex items-center justify-between mb-6">
          <label className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <Globe size={18} className="text-accent-primary" />
            </div>
            Keywords & Detection Phrases
          </label>

          <div className="flex bg-black/80 rounded-lg p-1 border border-white/10 shadow-lg">
            {parsed.ruleSet.languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={clsx(
                  'px-5 py-2 text-xs font-bold rounded-md transition-all duration-200 uppercase tracking-wider relative z-10',
                  activeLang === lang
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
                )}
                style={{
                  backgroundColor:
                    activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-black/40 rounded-2xl border border-white/10 p-2 shadow-inner group">
          <TagInput
            className="h-full border-none bg-transparent items-start content-start p-6"
            tags={active.keywords?.[activeLang] || []}
            onChange={onKeywordsChange}
            placeholder={`Type a keyword in ${activeLang.toUpperCase()} (e.g. "slow", "bug") and press Enter...`}
          />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-muted px-2 font-medium">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            Press <b className="text-white">Enter</b> or <b className="text-white">Comma</b>{' '}
            to link tags
          </span>
          <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <b className="text-white">{active.keywords?.[activeLang]?.length || 0}</b>{' '}
            keywords active in {activeLang.toUpperCase()}
          </span>
        </div>
      </div>
    </>
  );
}
