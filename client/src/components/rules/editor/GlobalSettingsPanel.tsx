import { Globe, Hash, Layers } from 'lucide-react';
import type { RuleConfig } from './types';

interface GlobalSettingsPanelProps {
  parsed: RuleConfig;
  onMinScoreChange: (value: string) => void;
}

export function GlobalSettingsPanel({
  parsed,
  onMinScoreChange,
}: GlobalSettingsPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-6 p-4 glass-panel rounded-xl border border-white/5 bg-black/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent-primary/10 rounded-lg text-accent-primary border border-accent-primary/20 shadow-sm">
          <Globe size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <label className="text-[10px] text-muted block mb-0.5 uppercase tracking-widest font-bold opacity-60">
            Rule Name
          </label>
          <div className="text-base font-bold text-white tracking-tight truncate">
            {parsed.ruleSet.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-x border-white/5 px-6">
        <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20 shadow-sm">
          <Hash size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <label className="text-[10px] text-muted block mb-0.5 uppercase tracking-widest font-bold opacity-60">
            Version
          </label>
          <div className="text-base font-bold text-white tracking-tight truncate text-gradient">
            {parsed.ruleSet.version}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-3">
        <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-sm">
          <Layers size={20} />
        </div>
        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="overflow-hidden">
            <label className="text-[10px] text-muted block mb-0.5 uppercase tracking-widest font-bold opacity-60">
              Min Score
            </label>
            <div className="text-xs text-muted font-medium">Activation Threshold</div>
          </div>
          <input
            type="number"
            className="!bg-black/60 border border-white/10 focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 rounded-lg px-3 py-1.5 text-sm text-white w-20 transition-all font-mono font-bold shadow-inner"
            value={parsed.ruleSet.global?.minScore || 1}
            onChange={(event) => onMinScoreChange(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
