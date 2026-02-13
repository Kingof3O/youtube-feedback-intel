import { Plus } from 'lucide-react';
import clsx from 'clsx';
import type { RuleConfig } from './types';

interface CategorySidebarProps {
  parsed: RuleConfig;
  activeCategory: string | null;
  onSelectCategory: (name: string) => void;
  onAddCategory: () => void;
}

export function CategorySidebar({
  parsed,
  activeCategory,
  onSelectCategory,
  onAddCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex justify-between items-center mb-1 px-1">
        <h3 className="text-xs font-bold text-muted uppercase tracking-widest opacity-70">
          Categories
        </h3>
        <button
          onClick={onAddCategory}
          className="p-1.5 hover:bg-white/10 rounded-lg text-accent-primary transition-all active:scale-95 shadow-sm"
          title="Add Category"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {Object.keys(parsed.ruleSet.categories).map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={clsx(
              'flex justify-between items-center p-4 rounded-xl text-left transition-all duration-200 border group relative overflow-hidden shadow-sm',
              activeCategory === category
                ? '!bg-accent-primary/20 !border-accent-primary/50 text-white'
                : '!bg-black/40 border-white/10 text-gray-300 hover:!bg-black/60 hover:border-white/20 hover:text-white',
            )}
            style={{
              backgroundColor:
                activeCategory === category ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.4)',
            }}
          >
            {activeCategory === category && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-primary to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
            <span
              className={clsx(
                'truncate font-semibold text-sm transition-all duration-200',
                activeCategory === category ? 'translate-x-2 text-white' : 'text-gray-300',
              )}
            >
              {category}
            </span>
            <div
              className={clsx(
                'text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all',
                activeCategory === category
                  ? 'bg-accent-primary/40 text-white border-accent-primary/50 shadow-sm'
                  : 'bg-black/60 text-gray-400 border-white/10',
              )}
            >
              {parsed.ruleSet.categories[category].score} pts
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
