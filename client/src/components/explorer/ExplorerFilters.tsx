import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface ExplorerFiltersProps {
  search: string;
  category: string;
  minLikes: string;
  viewMode: 'classified' | 'all';
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinLikesChange: (value: string) => void;
  onViewModeChange: (value: 'classified' | 'all') => void;
}

export function ExplorerFilters({
  search,
  category,
  minLikes,
  viewMode,
  categories,
  onSearchChange,
  onCategoryChange,
  onMinLikesChange,
  onViewModeChange,
}: ExplorerFiltersProps) {
  return (
    <div className="glass-panel p-4 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <Input
          label="Search"
          placeholder="Search comments..."
          leftIcon={<Search size={16} />}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="w-[150px]">
        <label className="text-sm font-medium text-muted mb-1.5 block">Category</label>
        <select
          className="w-full bg-black/20 border border-white/10 rounded-md h-[40px] px-3 text-sm text-white focus:outline-none focus:border-accent-primary"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={viewMode === 'all'}
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="w-[100px]">
        <Input
          label="Min Likes"
          type="number"
          value={minLikes}
          onChange={(event) => onMinLikesChange(event.target.value)}
        />
      </div>
      <div className="flex items-center h-[40px] bg-black/20 rounded-md p-1 border border-white/10">
        <button
          onClick={() => onViewModeChange('classified')}
          className={`px-3 h-full rounded text-xs font-medium transition-colors ${
            viewMode === 'classified'
              ? 'bg-accent-primary text-white'
              : 'text-muted hover:text-white'
          }`}
        >
          Classified
        </button>
        <button
          onClick={() => onViewModeChange('all')}
          className={`px-3 h-full rounded text-xs font-medium transition-colors ${
            viewMode === 'all'
              ? 'bg-accent-primary text-white'
              : 'text-muted hover:text-white'
          }`}
        >
          Raw
        </button>
      </div>
    </div>
  );
}
